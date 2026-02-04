export default function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl" href="/">My Compiler</a>
            </div>
            <button className="btn btn-primary">Login</button>
        </div>
    );
}
