import pandas as pd
import numpy as np
from scipy.sparse import lil_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
import pickle
import logging
from bson import ObjectId  # Add ObjectId import for MongoDB ID handling

class RecipeRecommender:
    def __init__(self, mongo_uri='mongodb://localhost:27017', db_name='tekks', collection_name='tekks'):
        """Ensure the URI is correctly assigned."""
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]
        self.df = None
        self.similarity_matrix = None
        logging.basicConfig(level=logging.INFO)  # Setup logging configuration

    def load_data(self):
        """Loads data from MongoDB and converts it into a pandas DataFrame"""
        try:
            recipes = list(self.collection.find())
            if not recipes:
                logging.warning("No recipes found in the collection.")
            self.df = pd.DataFrame(recipes)
            return self.df
        except Exception as e:
            logging.error(f"Error loading data from MongoDB: {str(e)}")
            return pd.DataFrame()

    def preprocess_data(self):
        """Preprocess the data by combining text fields into a single content column"""
        def extract_text(field):
            """Safely extract text from fields like ingredients, usda_ingredients, and instructions"""
            if isinstance(field, list):
                return " ".join([i['text'] for i in field if isinstance(i, dict)])
            return ""

        try:
            self.df['content'] = (
                self.df['title'].str.lower() + " " +
                self.df['ingredients'].apply(extract_text) + " " +
                self.df['usda_ingredients'].apply(extract_text) + " " +
                self.df['instructions'].apply(extract_text)
            )
            return self.df
        except Exception as e:
            logging.error(f"Error in preprocess_data: {str(e)}")
            return self.df

    def compute_similarity(self, batch_size=500):
        """Compute the similarity matrix using TF-IDF and cosine similarity"""
        try:
            vectorizer = TfidfVectorizer(stop_words='english', max_features=10000)
            tfidf_matrix = vectorizer.fit_transform(self.df['content'])

            # Using sparse matrix to store similarity scores efficiently
            similarity_matrix = lil_matrix((tfidf_matrix.shape[0], tfidf_matrix.shape[0]), dtype=np.float32)

            # Compute cosine similarity in batches to avoid memory overload
            for start_idx in range(0, tfidf_matrix.shape[0], batch_size):
                end_idx = min(start_idx + batch_size, tfidf_matrix.shape[0])
                batch_tfidf = tfidf_matrix[start_idx:end_idx]
                similarity_batch = cosine_similarity(batch_tfidf, tfidf_matrix)
                similarity_matrix[start_idx:end_idx, :] = similarity_batch

            self.similarity_matrix = similarity_matrix.tocsr()
        except Exception as e:
            logging.error(f"Error in compute_similarity: {str(e)}")

    def recommend_recipes(self, recipe_id, top_n=5):
        """Get the top N most similar recipes to a given recipe"""
        try:
            if self.df is None or self.similarity_matrix is None:
                logging.error("DataFrame or similarity matrix not loaded properly.")
                return []

            # Ensure recipe ID is converted to ObjectId if it's a string
            if isinstance(recipe_id, str):
                recipe_id = ObjectId(recipe_id)

            # Ensure the '_id' column exists and recipe_id is valid
            if '_id' not in self.df.columns:
                logging.error("DataFrame does not have '_id' column.")
                return []

            if recipe_id not in self.df['_id'].values:
                logging.warning(f"Recipe ID {recipe_id} not found in the DataFrame.")
                return []

            # Find the index of the given recipe ID in the DataFrame
            recipe_idx = self.df[self.df['_id'] == recipe_id].index[0]

            # Get similarity scores for the recipe
            similarity_scores = list(enumerate(self.similarity_matrix[recipe_idx].toarray()[0]))
            similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

            # Fetch top N recipes
            top_recipes = [self.df.iloc[i[0]] for i in similarity_scores[1:top_n+1]]
            return top_recipes
        except Exception as e:
            logging.error(f"Error in recommend_recipes: {str(e)}")
            return []

    def save_model(self, file_path='similarity_matrix.pkl'):
        """Save the similarity matrix to a file for future use"""
        try:
            with open(file_path, 'wb') as f:
                pickle.dump(self.similarity_matrix, f)
        except Exception as e:
            logging.error(f"Error saving the model: {str(e)}")

    def load_model(self, file_path='similarity_matrix.pkl'):
        """Load the similarity matrix from a file"""
        try:
            with open(file_path, 'rb') as f:
                self.similarity_matrix = pickle.load(f)
        except Exception as e:
            logging.error(f"Error loading the model: {str(e)}")