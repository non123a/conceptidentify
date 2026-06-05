from sentence_transformers import SentenceTransformer
from pgvector.django import CosineDistance

from materials.models import MaterialChunk


model = SentenceTransformer(
    'sentence-transformers/all-MiniLM-L6-v2'
)


# def search_chunks(query, limit=3):

#     query_embedding = model.encode(query).tolist()

#     results = (
#         MaterialChunk.objects
#         .annotate(
#             distance=CosineDistance(
#                 'embedding',
#                 query_embedding
#             )
#         )
#         .order_by('distance')[:limit]
#     )

#     return results
def search_chunks(
    query,
    topic_id,
    limit=3
):

    query_embedding = (
        model.encode(query)
        .tolist()
    )

    results = (

        MaterialChunk.objects

        .filter(
            material__topic_id=topic_id
        )

        .annotate(
            distance=CosineDistance(
                "embedding",
                query_embedding
            )
        )

        .order_by("distance")[:limit]

    )

    return results