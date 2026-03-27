type HeaderProps = {
    className?: string;
}

export default function Header({ className }: HeaderProps) {
    const tabStyles = "p-1 hover:cursor-pointer hover:text-highlight hover:border-b-1 hover:border-highlight"
        
    return(
        <div className={`header sticky top-0 z-10 flex flex-row justify-between items-center p-5 border-b-2 ${className}`}>
            <span>Chan Hen</span>
            <div className="flex flex-row gap-5">
                <div className={tabStyles}>Home</div>
                <div className={tabStyles}>About</div>
                <div className={tabStyles}>Projects</div>
                <div className={tabStyles}>Contact</div>
            </div>
        </div>
    )
}