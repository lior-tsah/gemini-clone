import "./Wrapper.css";

interface ContentPageWrapperProps {
    title: string;
    description: string;
    children: any;
    optionalChildren?: any;
    typePage?: string;
}

const ContentPageWrapper = (props: ContentPageWrapperProps) => {
    const { title, description, children, optionalChildren, typePage = "main" } = props;

    return (
        <div className="home-main-container">
            <div className="flex-3">
                <div className={`${typePage === "main" ? "text-center" : "text-left"}`}>
                    <label className={`${typePage === "main" ? "home-title" : "secondery-title"} `}>{title}</label>
                    <label className="home-sub-title">{description}</label>
                </div>
                {children}
            </div>
            {optionalChildren}
        </div>
    )
}
export default ContentPageWrapper;