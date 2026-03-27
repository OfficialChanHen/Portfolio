type HeaderProps = {
    className?: string;
}

export default function Header({ className }: HeaderProps) {
    const tabStyles = `
                        h-full flex flex-col justify-center items-center border-b-2 border-transparent hover:cursor-pointer hover:text-highlight
                        relative after:absolute after:bottom-[-1px] after:left-0
                        after:h-[2px] after:w-0 after:bg-highlight
                        after:transition-all after:duration-400 after:ease-out
                        hover:after:w-full
                    `
        
    return(
        <div className={`header sticky top-0 z-10 flex flex-row justify-between items-center border-b-2 ${className}`}>
            <span className="p-5">Chan Hen</span>
            <div className="h-full flex flex-row justify-center items-center px-5 gap-4">
                <div className={tabStyles}>Home</div>
                <div className={tabStyles}>About</div>
                <div className={tabStyles}>Projects</div>
                <div className={tabStyles}>Contact</div>
            </div>
        </div>
    )
}