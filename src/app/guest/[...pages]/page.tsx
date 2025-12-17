"use client";

import { redirect, usePathname } from "next/navigation";

function Page() {
  const pathName = usePathname();

  const viewPath = pathName.replace("guest", "view");

  redirect(viewPath);
}

export default Page;
