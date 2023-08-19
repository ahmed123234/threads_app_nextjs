const SuggestedList = ({ data, title } : {data?: [], title: string}) => (
  <div className="flex flex-1 flex-col justify-start">
        <h3 className=" text-heading4-medium text-light-1 capitalize">{title}</h3>
      </div>
)
const RightSidebar = () => {
  return (
    <section className="custom-scrollbar rightsidebar">
      <SuggestedList title="suggested communities" />
      <SuggestedList title="suggested users" />
    </section>
  )
}

export default RightSidebar