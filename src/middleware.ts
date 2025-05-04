export { default } from "next-auth/middleware";

//  add protected routes here
export const config = {
  matcher: ["/admin"]
};
