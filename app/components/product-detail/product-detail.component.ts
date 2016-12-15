import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

import { ConfirmationService } from "primeng/primeng";

import { Product } from "../../models/product";
import { ProductService } from "../../services/product.service";
import getPrototypeOf = Reflect.getPrototypeOf;



@Component({
    templateUrl: "./app/components/product-detail/product-detail.component.html",
    styleUrls: ["./app/components/product-detail/product-detail.component.css"]
})
export class ProductDetailComponent implements OnDestroy, OnInit {

    private _product: Product;
    private _productSubscription: Subscription;

    private _productLikeLocalStorageKey: string;
    private _productLiked: boolean = false;

    constructor(
        private _productService: ProductService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        // this._route.data.forEach((data: { product: Product }) => this._product = data.product);
        this._route.data.forEach((data: { product: Product }) => {
            this._product = data.product;
            this._productLikeLocalStorageKey = `whatapop-product-likes-${this._product.id}`;
            this._productLiked = this._getProductLike();
        });
        window.scrollTo(0, 0);
    }

    ngOnDestroy(): void {
        if (this._productSubscription !== undefined) {
            this._productSubscription.unsubscribe();
        }
    }

    private _buyProduct(): void {
        this._productSubscription = this._productService
                                        .buyProduct(this._product.id)
                                        .subscribe(() => this._showPurchaseConfirmation())
    }

    private _showPurchaseConfirmation(): void {
        this._confirmationService.confirm({
            rejectVisible: false,
            message: "Producto comprado. ¡Enhorabuena!",
            accept: () => this._router.navigate(["/product"])
        });
    }
    
    getImageSrc(): string {
        return this._product && this._product.photos.length > 0 ? this._product.photos[0] : "";
    }

    showPurchaseWarning(): void {
        this._confirmationService.confirm({
            message: `Vas a comprar ${this._product.name}. ¿Estás seguro?`,
            accept: () => this._buyProduct()
        });
    }

    goBack(): void {
        window.history.back();
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
    | Broken White Path                                                |
    |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
    | Funciones manejadoras de los Like de un Producto                 |
    |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    // Función que recupera si el producto tiene un Like
    private _getProductLike(): boolean {
        if (typeof(Storage) !== undefined) {
            return localStorage.getItem(this._productLikeLocalStorageKey) === "true";
        }
    }

    // Función que establece un Like al Producto
    private _setProductLike(like: boolean): void {
        if (typeof(Storage) !== undefined) {
            localStorage.setItem(this._productLikeLocalStorageKey, (like ? "true" : "false"));
        }
    }

    // Función manejadora de Likes. Activa o desactiva el Like del Producto
    likingProduct(): void {
        this._productLiked = !this._productLiked;
        this._setProductLike(this._productLiked);
    }
}
