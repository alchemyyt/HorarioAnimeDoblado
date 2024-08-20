//los corchetes son para hacer una ruta dinamica osea que no hay que poner un query en el url
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
export const PATCH = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category; //esto es la info que esta en cada url que usamos en este caso el ide de la categoria y el .category final es el nobre de lo que tenemos en corchetes y tambien es la variable de lo que se escriba en la url
  try {
    const body = await request.json();
    const { title } = body;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    // si no  escribiste bien el user
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missig user id" }),
        { status: 400 }
      );
    }
    // si no escribiste bien la categoria
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missig category" }),
        { status: 404 }
      );
    }
    //se conecta al database
    await connect();
    //busca en la base de datos de usuarios el usuario
    const user = await User.findById(userId);
    // si el usuario no existe en la base de datos
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }
    //esto busca la categoria que queremos cambier y tambien revisa si la creo el usuario para poder cambiarla tiene que ser el dueño
    const category = await Category.findOne({
      //esto lleva como parametro un objeto para buscar el objeto en base a coincidencias de clave-valor
      _id: categoryId,
      user: userId,
    });
    // si la categoria existe
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      //usa como parametro una id en este caso la de la url y hace el cambio
      categoryId,
      { title },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({
        message: "Category updated",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating category" + error.message, {
      status: 500,
    });
  }
};
export const DELETE = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    // si no  escribiste bien el user
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missig user id" }),
        { status: 400 }
      );
    }
    // si no escribiste bien la categoria
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missig category" }),
        { status: 404 }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: "Category not found or does not belong to the user",
        }),
        { status: 404 }
      );
    }
    await Category.findByIdAndDelete(categoryId);
    return new NextResponse(
      JSON.stringify({ message: "category is deleted" }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting category" + error.message, {
      status: 500,
    });
  }
};
