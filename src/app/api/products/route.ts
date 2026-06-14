import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { withAdminAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { createProductSchema } from "@/lib/validators/product.validator";
import { ProductFilters } from "@/types";

const ITEMS_PER_PAGE = parseInt(process.env.ITEMS_PER_PAGE ?? "12");

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const filters: ProductFilters = {
      search: searchParams.get("search") ?? undefined,
      categoryId: searchParams.get("categoryId") ?? undefined,
      brandId: searchParams.get("brandId") ?? undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined,
      inStock: searchParams.get("inStock") === "true" ? true : undefined,
      onSale: searchParams.get("onSale") === "true" ? true : undefined,
      isFeatured: searchParams.get("isFeatured") === "true" ? true : undefined,
      sortBy: (searchParams.get("sortBy") as ProductFilters["sortBy"]) ?? "newest",
      page: Number(searchParams.get("page") ?? "1"),
      limit: Number(searchParams.get("limit") ?? ITEMS_PER_PAGE),
    };

    const where: any = { status: "ACTIVE" };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { sku: { contains: filters.search, mode: "insensitive" } },
        { brand: { name: { contains: filters.search, mode: "insensitive" } } },
        { category: { name: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.brandId) where.brandId = filters.brandId;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.inStock) where.stock = { gt: 0 };
    if (filters.onSale) where.discountPrice = { not: null };
    if (filters.minRating) where.rating = { gte: filters.minRating };

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    const orderByMap: Record<string, any> = {
      newest: { createdAt: "desc" },
      price_asc: { price: "asc" },
      price_desc: { price: "desc" },
      best_selling: { soldCount: "desc" },
      top_rated: { rating: "desc" },
    };

    const orderBy = orderByMap[filters.sortBy ?? "newest"];
    const skip = ((filters.page ?? 1) - 1) * (filters.limit ?? ITEMS_PER_PAGE);
    const take = filters.limit ?? ITEMS_PER_PAGE;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          images: true,
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Products fetched",
      data: products,
      meta: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / (filters.limit ?? ITEMS_PER_PAGE)),
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export const POST = withAdminAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { images, ...productData } = parsed.data;
    const slug = slugify(productData.name, { lower: true, strict: true });

    const product = await prisma.product.create({
      data: {
        ...productData,
        slug,
        price: productData.price,
        discountPrice: productData.discountPrice,
        images: { create: images.map((url) => ({ url })) },
      },
      include: { images: true },
    });

    return NextResponse.json({ success: true, message: "Product created", data: product }, { status: 201 });
   } catch (error) {
    console.error("PRODUCT_CREATE_ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
});