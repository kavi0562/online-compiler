import Navbar from "../components/Navbar";
import Editor from "../components/Editor";
import Output from "../components/Output";

export default function Home() {
    return (
        <>
            <Navbar />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Editor />
                <Output />
            </div>
        </>
    );
}
