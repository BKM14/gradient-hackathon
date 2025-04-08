import cv2
import numpy as np
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
import os


# Define HSV color ranges
COLOR_RANGES = {
    "red":    [(0, 50, 50), (10, 255, 255)],
    "red2":   [(160, 50, 50), (180, 255, 255)],
    "orange": [(10, 100, 100), (20, 255, 255)],
    "yellow": [(20, 100, 100), (35, 255, 255)],
    "green":  [(40, 50, 50), (80, 255, 255)],
    "cyan":   [(81, 50, 50), (90, 255, 255)],
    "blue":   [(91, 50, 50), (130, 255, 255)],
    "purple": [(131, 50, 50), (145, 255, 255)],
    "pink":   [(146, 50, 50), (159, 255, 255)],
    "brown":  [(10, 50, 20), (20, 200, 200)],
    "black":  [(0, 0, 0), (180, 255, 40)]
}

# BGR colors for drawing
BGR_COLORS = {
    "red":    [255, 0, 0],
    "red2":   [255, 0, 0],
    "orange": [255, 165, 0],
    "yellow": [255, 255, 0],
    "green":  [0, 255, 0],
    "cyan":   [0, 255, 255],
    "blue":   [0, 0, 255],
    "purple": [128, 0, 128],
    "pink":   [255, 105, 180],
    "brown":  [165, 42, 42],
    "black":  [50, 50, 50]
}


def load_and_convert_image(image_path):
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    return image, image_rgb, image_hsv


def detect_colors(image_hsv, image_rgb, color_ranges):
    output = image_rgb.copy()
    labelled_image = image_rgb.copy()
    color_pixel_count = {}

    for color_name, (lower, upper) in color_ranges.items():
        lower_np = np.array(lower, dtype=np.uint8)
        upper_np = np.array(upper, dtype=np.uint8)
        mask = cv2.inRange(image_hsv, lower_np, upper_np)
        count = cv2.countNonZero(mask)
        color_pixel_count[color_name] = count

        draw_color = BGR_COLORS.get(color_name, [0, 0, 0])
        output[mask > 0] = draw_color

        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in contours:
            if cv2.contourArea(cnt) > 300:
                x, y, w, h = cv2.boundingRect(cnt)
                cv2.rectangle(labelled_image, (x, y), (x + w, y + h), draw_color, 2)
                cv2.putText(labelled_image, color_name.replace("2", ""), (x, y - 5),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)

    return output, labelled_image, color_pixel_count


def merge_color_counts(raw_counts):
    return {
        "red": raw_counts.get("red", 0) + raw_counts.get("red2", 0),
        "orange": raw_counts.get("orange", 0),
        "yellow": raw_counts.get("yellow", 0),
        "green": raw_counts.get("green", 0),
        "cyan": raw_counts.get("cyan", 0),
        "blue": raw_counts.get("blue", 0),
        "purple": raw_counts.get("purple", 0),
        "pink": raw_counts.get("pink", 0),
        "brown": raw_counts.get("brown", 0),
        "black": raw_counts.get("black", 0)
    }


def get_predominant_color(merged_counts):
    return max(merged_counts, key=merged_counts.get)


def show_result(image_rgb, output, labelled_image, predominant_color):
    plt.figure(figsize=(16, 6))
    plt.subplot(1, 3, 1)
    plt.imshow(image_rgb)
    plt.title("Original Image")
    plt.axis("off")

    plt.subplot(1, 3, 2)
    plt.imshow(output)
    plt.title("Color-Segmented Zones")
    plt.axis("off")

    plt.subplot(1, 3, 3)
    plt.imshow(labelled_image)
    plt.title(f"Predominant Color: {predominant_color}")
    plt.axis("off")

    plt.tight_layout()
    plt.show()
    plt.savefig("color_segmentation_result.png", dpi=300)


def process_image(image_path):
    original, rgb, hsv = load_and_convert_image(image_path)
    output, labelled, color_counts = detect_colors(hsv, rgb, COLOR_RANGES)
    merged_counts = merge_color_counts(color_counts)
    predominant_color = get_predominant_color(merged_counts)
    show_result(rgb, output, labelled, predominant_color)


def process_image_data(image_data):
    # Convert image data to numpy array
    np_arr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Process the image
    output, labelled, color_counts = detect_colors(image_hsv, image_rgb, COLOR_RANGES)
    merged_counts = merge_color_counts(color_counts)
    predominant_color = get_predominant_color(merged_counts)

    # Save the result image
    result_filename = "color_segmentation_result.png"
    result_path = os.path.abspath(result_filename)  # Get absolute path
    plt.figure(figsize=(16, 6))
    plt.subplot(1, 3, 1)
    plt.imshow(image_rgb)
    plt.title("Original Image")
    plt.axis("off")

    plt.subplot(1, 3, 2)
    plt.imshow(output)
    plt.title("Color-Segmented Zones")
    plt.axis("off")

    plt.subplot(1, 3, 3)
    plt.imshow(labelled)
    plt.title(f"Predominant Color: {predominant_color}")
    plt.axis("off")

    plt.tight_layout()
    plt.savefig(result_path, dpi=300)
    plt.close()

    return {
        "color_counts": merged_counts,
        "predominant_color": predominant_color,
        "result_path": result_path,
        "text": "Result of implementation"
    }


app = Flask(__name__)

@app.route('/process_image', methods=['POST'])
def process_image_endpoint():
    try:
        # Get the absolute path from the request body
        data = request.get_json()
        if not data or 'path' not in data:
            return jsonify({"error": "No image path provided"}), 400

        image_path = data['path']
        if not os.path.exists(image_path):
            return jsonify({"error": "Image file does not exist"}), 400

        print(f"Processing image at: {image_path}")

        # Process the image using the provided path
        image, image_rgb, image_hsv = load_and_convert_image(image_path)
        output, labelled, color_counts = detect_colors(image_hsv, image_rgb, COLOR_RANGES)
        merged_counts = merge_color_counts(color_counts)
        predominant_color = get_predominant_color(merged_counts)

        # Save the result image
        result_filename = "color_segmentation_result.png"
        result_path = os.path.abspath(result_filename)
        plt.figure(figsize=(16, 6))
        plt.subplot(1, 3, 1)
        plt.imshow(image_rgb)
        plt.title("Original Image")
        plt.axis("off")

        plt.subplot(1, 3, 2)
        plt.imshow(output)
        plt.title("Color-Segmented Zones")
        plt.axis("off")

        plt.subplot(1, 3, 3)
        plt.imshow(labelled)
        plt.title(f"Predominant Color: {predominant_color}")
        plt.axis("off")

        plt.tight_layout()
        plt.savefig(result_path, dpi=300)
        plt.close()

        # Return the result
        return jsonify({
            "color_counts": merged_counts,
            "predominant_color": predominant_color,
            "result_path": result_path,
            "text": "Image processed successfully"
        })
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5002)