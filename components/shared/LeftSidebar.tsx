// import { currentUser } from "@clerk/nextjs";
import SidebarLinks  from "./SidebarLinks";
import  SignedInCheck  from "./SignedInCheck";

const LeftSidebar = async () => {

  // const user = await currentUser();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        <SidebarLinks />
      </div>

      <div className="mt-10 px-6">
        <SignedInCheck position="left"/>
      </div>
    </section>
  )
}

export default LeftSidebar