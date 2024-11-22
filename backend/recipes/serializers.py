from rest_framework import serializers

class TekkSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField(max_length=255)
    url = serializers.URLField(allow_blank=True, required=False)
    ingredients = serializers.ListField(
        child=serializers.CharField(), required=False
    )
    instructions = serializers.ListField(
        child=serializers.CharField(), required=False
    )
