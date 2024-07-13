from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
from .utils import get_data, extract_product_info


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


@api_view(['POST'])
def process_url(request):
    url = request.data.get('url')
    
    data = get_data(url)

    # Initialize an empty dictionary to hold unique product details
    unique_products = {}

    if isinstance(data, list):
        data = data[0]
    
    extracted_info = extract_product_info(data)
    title = extracted_info['title']
    
    if title not in unique_products.keys():
        unique_products['title'] = title
        unique_products['description'] = extracted_info['description']
        unique_products['price'] = extracted_info['price']
        unique_products['image_url'] = extracted_info['image_url']
        unique_products['product_url'] = extracted_info['product_url']
        unique_products['size'] = extracted_info['size']
        unique_products['brand'] = extracted_info['brand']

    # Print the unique products dictionary
    print('list to append to db: ', unique_products)

    product = Product.objects.create(
        title=unique_products['title'],
        brand=unique_products['brand'],
        description=unique_products['description'],
        price=unique_products['price'],
        image_url=unique_products['image_url'],
        product_url=unique_products['product_url'],
        size=unique_products['size']
    )
    serializer = ProductSerializer(product)
    return Response(serializer.data)