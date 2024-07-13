from django.db import models

class Product(models.Model):
    title = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    product_url = models.URLField(null=True, blank=True)
    size = models.CharField(max_length=20, null=True, blank=True)
    brand = models.CharField(max_length=50)

    def __str__(self):
        return self.name

