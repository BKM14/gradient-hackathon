from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGODB_DB_NAME")]
collection = db[os.getenv("MONGODB_COLLECTION_NAME")]

def save_article(article_data):
    article_data['createdAt'] = datetime.now()
    result = collection.insert_one(article_data)
    article_data['_id'] = str(result.inserted_id)
    return article_data
