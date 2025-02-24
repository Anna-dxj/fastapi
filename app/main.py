from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging 
import sys 
from app.db import create_db
from app.routes import product, category

load_dotenv()
frontend_origin = os.getenv('FRONTEND_PORT')
print(f'Frontend origin: {frontend_origin}')
origins = [frontend_origin] if frontend_origin else []

app = FastAPI()

create_db()

logging.basicConfig(
    level=logging.ERROR,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('errors.log', mode='a')
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.exception_handler(Exception)
async def unhandled_exception_handler(request, exec):
    logging.error(f'Unhandled exception: {exec}', exec_info=True)
    return JSONResponse(
        status_code=500,
        content={
            'detail': 'Internal Server Error. Error has been logged'
        }
    )

app.include_router(product.router, prefix='/api/products', tags=['products'])
app.include_router(category.router, prefix='/api/category', tags=['category'])

app.mount('/static', StaticFiles(directory='app/static'), name='static')

@app.get('/')
def serve_home():
    return FileResponse('app/static/templates/index.html')

@app.get('/products')
def serve_all_products():
    return FileResponse('app/static/templates/all-products.html')

# get all categories
@app.get('/categories')
def serve_all_categories():
    return FileResponse('app/static/templates/all-categories.html')

# get all category products
@app.get('/categories/{categoryId}/products')
def serve_products_by_category(categoryId: str):
    return FileResponse('app/static/templates/product-by-category.html')
# add a product
@app.get('/products/add-product')
def serve_add_product():
    return FileResponse('app/static/templates/add-product.html')
# update product
@app.get('/products/update/{productId}')
def serve_update_product():
    return FileResponse('app/static/templates/update-product.html')