from sentence_transformers import SentenceTransformer


model = SentenceTransformer(
    'sentence-transformers/all-MiniLM-L6-v2'
)


def generate_embeddings(texts):
    embeddings = model.encode(
        texts,
        batch_size=32,
        convert_to_numpy=True,
        show_progress_bar=False,
    )

    return embeddings.tolist()
# def generate_embedding(text):

#     embedding = model.encode(text)

#     return embedding.tolist()