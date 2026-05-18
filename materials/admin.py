from django.contrib import admin

from .models import Material, MaterialChunk


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'title',
        'topic',
        'uploaded_by',
        'uploaded_at',
    )


@admin.register(MaterialChunk)
class MaterialChunkAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'material',
        'chunk_index',
    )

    search_fields = (
        'chunk_text',
    )