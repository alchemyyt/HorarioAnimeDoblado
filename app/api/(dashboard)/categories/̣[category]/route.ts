//los corchetes son para hacer una ruta dinamica osea que no hay que poner un query en el url
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
