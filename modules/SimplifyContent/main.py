import os
import json
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain.chains import LLMChain
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    temperature=0.5,
    model_name="gemma2-9b-it",
    groq_api_key=os.getenv("GROQ_API_KEY")
)

simplify_prompt = PromptTemplate.from_template("""
Rewrite the following content in a way that is:
- Easy to understand for people with ADHD
- Uses short, simple sentences
- Explains difficult words
- Uses a casual and friendly tone
                                               
Rules:
- Follow the Global Rules strictly.
- DO NOT explain your process.
- DO NOT output any meta-comments or notes.
- ONLY output the requested content directly.

Content: {input_text}
""")
simplify_chain = LLMChain(llm=llm, prompt=simplify_prompt, output_key="simplified_text")

chunk_prompt = PromptTemplate.from_template("""
Split this content into ADHD-friendly chunks:
- Add clear section headings
- Use bullet points where possible
- Keep paragraphs very short (2-3 sentences)


Content: {simplified_text}
""")
chunk_chain = LLMChain(llm=llm, prompt=chunk_prompt, output_key="chunked_text")

highlight_prompt = PromptTemplate.from_template("""
Highlight key words and important ideas by wrapping them in **bold** markers.

Content: {chunked_text}
""")
highlight_chain = LLMChain(llm=llm, prompt=highlight_prompt, output_key="highlighted_text")

engagement_prompt = PromptTemplate.from_template("""
Add attention-grabbing elements:
- Fun fact boxes
- Quick quizzes
- Emoji markers(use only when really important)
- Section summaries
     

Content: {highlighted_text}
""")
engagement_chain = LLMChain(llm=llm, prompt=engagement_prompt, output_key="engaged_text")

hook_prompt = PromptTemplate.from_template("""
Generate a short, engaging hook to grab the attention of a person with ADHD learning the following content.
                                           
Rules:
- Follow the Global Rules strictly.
- DO NOT explain your process.
- DO NOT output any meta-comments or notes.
- ONLY output the requested content directly.

Content: {input_text}
""")
hook_chain = LLMChain(llm=llm, prompt=hook_prompt, output_key="adhd_hook")

outro_prompt = PromptTemplate.from_template("""
Generate a curiosity-driven outro encouraging the reader to explore more.


Content: {engaged_text}
""")
outro_chain = LLMChain(llm=llm, prompt=outro_prompt, output_key="adhd_outro")

adhd_transform_chain = (
    hook_chain
    | simplify_chain
    | chunk_chain
    | highlight_chain
    | engagement_chain
    | outro_chain
)

input_content = """
What is Artificial Intelligence?

Artificial Intelligence (AI) is a broad field of computer science focused on building smart machines capable of performing tasks that typically require human intelligence. These tasks include 
learning, reasoning, problem-solving, perception, and language understanding.
Narrow AI vs General AI

    Narrow AI: Specialized in one task (e.g., recommending products, recognizing faces).

    General AI: A machine with the ability to understand, learn, and apply knowledge in multiple domains, similar to a human.

Machine Learning

Machine learning is a subset of AI where machines learn from data instead of being explicitly programmed.

    Supervised Learning: Learning from labeled data.

    Unsupervised Learning: Finding patterns in data without labels.

    Reinforcement Learning: Learning by trial and error, using rewards and punishments.

Real-life Examples

    Virtual assistants (like Siri or Alexa)

    Recommendation systems (Netflix, YouTube)

    Self-driving cars

    Translation services

    Fraud detection systems
"""

result = adhd_transform_chain.invoke({"input_text": input_content})

output_json = {
    "title": "Understanding Artificial Intelligence",
    "hook": result['adhd_hook'],
    "content": result['engaged_text'],
    "outro": result['adhd_outro']
}

output_file_path = "./output.json"
with open(output_file_path, "w") as f:
    json.dump(output_json, f, indent=2)

print(f"JSON output written successfully to {output_file_path}")
