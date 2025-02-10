import { NextResponse } from "next/server";

export const successResponse = <T>(
  message: string,
  data: T,
  statusCode: number = 200
) => {
  return NextResponse.json(
    {
      status: statusCode,
      message: message,
      data: data,
    },
    {
      status: statusCode,
    }
  );
};

export const errorResponse = <T>(
  message: string,
  details?: T,
  statusCode: number = 400
) => {
  return NextResponse.json(
    { status: statusCode, message: message, details: details },
    { status: statusCode }
  );
};
