# def chunk_text(text, chunk_size=500):

#     words = text.split()

#     chunks = []

#     for i in range(0, len(words), chunk_size):

#         chunk = words[i:i + chunk_size]

#         chunks.append(
#             " ".join(chunk)
#         )

#     return chunks

# def chunk_text(text, chunk_size=200):

#     paragraphs = text.split("\n")

#     chunks = []
#     current_chunk = ""

#     for paragraph in paragraphs:

#         if len(current_chunk) + len(paragraph) < chunk_size:
#             current_chunk += " " + paragraph

#         else:
#             chunks.append(current_chunk.strip())
#             current_chunk = paragraph

#     if current_chunk:
#         chunks.append(current_chunk.strip())

#     return chunks


# import re

# def chunk_text(text, max_words=150, overlap_sentences=1):
#     # Split by punctuation followed by a space
#     sentences = re.split(r'(?<=[.!?])\s+', text)
    
#     chunks = []
#     current_chunk_sentences = []
#     current_word_count = 0
    
#     for sentence in sentences:
#         # Count words in the sentence, not characters
#         sentence_word_count = len(sentence.split())
        
#         # If adding the next sentence stays under the word limit
#         if current_word_count + sentence_word_count <= max_words:
#             current_chunk_sentences.append(sentence)
#             current_word_count += sentence_word_count
#         else:
#             # We hit the limit. Save the current chunk.
#             if current_chunk_sentences:
#                 chunks.append(" ".join(current_chunk_sentences).strip())
            
#             # Start the new chunk. 
#             # Bring over the last sentence of the previous chunk for context overlap.
#             if overlap_sentences > 0 and len(current_chunk_sentences) > 0:
#                 current_chunk_sentences = current_chunk_sentences[-overlap_sentences:] + [sentence]
#             else:
#                 current_chunk_sentences = [sentence]
                
#             # Recalculate word count for the new chunk
#             current_word_count = sum(len(s.split()) for s in current_chunk_sentences)
            
#     # Don't forget to append the final chunk
#     if current_chunk_sentences:
#         chunks.append(" ".join(current_chunk_sentences).strip())
        
#     return chunks


# import re

# def chunk_text(text, max_words=150):
#     # Step 1: Split the document by structural blocks (double newlines)
#     # This prevents 'Common Law' from ever mixing with 'Civil Law'
#     blocks = re.split(r'\n\s*\n', text)
    
#     chunks = []
    
#     for block in blocks:
#         block = block.strip()
#         if not block:
#             continue
            
#         block_word_count = len(block.split())
        
#         # Step 2: If the paragraph/slide is already small enough, keep it as one pure chunk.
#         if block_word_count <= max_words:
#             chunks.append(block)
        
#         # Step 3: Only apply sentence-splitting if a specific paragraph is massive.
#         else:
#             sentences = re.split(r'(?<=[.!?])\s+', block)
#             current_chunk = []
#             current_len = 0
            
#             for sentence in sentences:
#                 sentence_len = len(sentence.split())
#                 if current_len + sentence_len <= max_words:
#                     current_chunk.append(sentence)
#                     current_len += sentence_len
#                 else:
#                     if current_chunk:
#                         chunks.append(" ".join(current_chunk).strip())
#                     current_chunk = [sentence]
#                     current_len = sentence_len
                    
#             if current_chunk:
#                 chunks.append(" ".join(current_chunk).strip())
                
#     return chunks
# import re

# def chunk_text(text, max_words=150):
#     # Split the document anytime a new line starts with an outline header
#     # Matches: "I. ", "II. ", "A. ", "B. ", "C. ", etc.
#     blocks = re.split(r'\n\s*(?=[A-ZIVX]+\.\s)', text)
    
#     chunks = []
    
#     for block in blocks:
#         block = block.strip()
#         if not block:
#             continue
            
#         block_word_count = len(block.split())
        
#         if block_word_count <= max_words:
#             chunks.append(block)
#         else:
#             sentences = re.split(r'(?<=[.!?])\s+', block)
#             current_chunk = []
#             current_len = 0
            
#             for sentence in sentences:
#                 sentence_len = len(sentence.split())
#                 if current_len + sentence_len <= max_words:
#                     current_chunk.append(sentence)
#                     current_len += sentence_len
#                 else:
#                     if current_chunk:
#                         chunks.append(" ".join(current_chunk).strip())
#                     current_chunk = [sentence]
#                     current_len = sentence_len
                    
#             if current_chunk:
#                 chunks.append(" ".join(current_chunk).strip())
                
#     return chunks


import re

def chunk_text(text, max_words=150):
    """
    Chunks lecture slide text by structural outline headers, 
    filters out short junk items, and ensures no chunk exceeds max_words.
    """
    # Step 1: Split the document anytime a new line starts with an outline header
    # Matches: "I. ", "II. ", "A. ", "B. ", "C. ", etc.
    blocks = re.split(r'\n\s*(?=[A-ZIVX]+\.\s)', text)
    
    chunks = []
    
    for block in blocks:
        block = block.strip()
        if not block:
            continue
            
        block_word_count = len(block.split())
        
        # Step 2: The Junk Filter
        # If the chunk is less than 15 words, it's likely an Agenda item, 
        # a slide title, or a page number. Throw it away to keep vectors clean.
        if block_word_count < 15:
            continue 
        
        # Step 3: If the paragraph/slide is a good size, keep it as one pure chunk.
        if block_word_count <= max_words:
            chunks.append(block)
        
        # Step 4: Only apply sentence-splitting if a specific paragraph is massive.
        else:
            sentences = re.split(r'(?<=[.!?])\s+', block)
            current_chunk = []
            current_len = 0
            
            for sentence in sentences:
                sentence_len = len(sentence.split())
                
                # If adding the next sentence keeps us under the limit
                if current_len + sentence_len <= max_words:
                    current_chunk.append(sentence)
                    current_len += sentence_len
                else:
                    # We hit the limit. Save the current chunk.
                    if current_chunk:
                        chunks.append(" ".join(current_chunk).strip())
                    
                    # Start a new chunk with the current sentence
                    current_chunk = [sentence]
                    current_len = sentence_len
                    
            # Don't forget to append the final chunk from the loop
            if current_chunk:
                chunks.append(" ".join(current_chunk).strip())
                
    return chunks