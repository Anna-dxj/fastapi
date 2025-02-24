from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session 
from app.models import Product as ProductModel, Category as CategoryModel
from app.schemas import Product, ProductCreate, ProductUpdate
from typing import Optional
from app.db import get_session_local

router = APIRouter()

@router.get('/', response_model=list[Product])
def get_products_route(limit: int = 10, db: Session = Depends(get_session_local)):
    return db.query(ProductModel).limit(limit).all()

@router.get('/{product_id}', response_model=Product)
def get_product_route(product_id: int, db: Session=Depends(get_session_local)):
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()

    if product is None:
        raise HTTPException(status_code = 404, detail='Product not found')
    
    return product 

# Add products
@router.post('/add', response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product_route(product: ProductCreate, db: Session=Depends(get_session_local)):
    existing_product = db.query(ProductModel).filter(ProductModel.product_code == product.product_code).first()
    if existing_product:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail='Product with this product code already exists')

    new_product = ProductModel(
        product_code = product.product_code,
        description=product.description, 
        unit_price = product.unit_price,
        category_id=product.category_id
    )

    try:
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        return new_product
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f'Database error: {str(e)}')

# Update Products
@router.patch('/update/{product_id}', response_model=Product, status_code=status.HTTP_200_OK)
def update_product_route(product_id: int, product_update: ProductUpdate, db: Session=Depends(get_session_local)):
    existing_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not existing_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, deatil=f'Product ID {product_id} not found')
    
    try:
        if product_update.product_code is not None:
            # product_code must be unique
            existing_product_code = db.query(ProductModel).filter(
                ProductModel.product_code == product_update.product_code,
                ProductModel.id != product_id
            ).first()
            if existing_product_code: 
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Product code {product_update.product_code} already exists')
            
            existing_product.product_code = product_update.product_code
        if product_update.description is not None:
            existing_product.description = product_update.description 
        if product_update.unit_price is not None:
            existing_product.unit_price = product_update.unit_price
        if product_update.category_id is not None:
            category = db.query(CategoryModel).filter(CategoryModel.id == product_update.category_id).first()
            if not category:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Category Id {product_update.category_id} does not exist')
            existing_product.category_id = product_update.category_id 
        
        db.commit()
        db.refresh(existing_product)
        return existing_product 
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f'Database error: {str(e)}')

# Delete Products
@router.delete('/{product_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_product_route(product_id: int, db: Session=Depends(get_session_local)):
    existing_product=db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not existing_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Product id {product_id} not found')
    
    try:
        db.delete(existing_product)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except Exception as e: 
        db.rollback()
        raise HTTPException(status_code=500, detail=f'Database error: {str(e)}')
