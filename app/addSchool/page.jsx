import SchoolForm from "@/components/SchoolForm";

export const metadata = {title: "Add School"}

export default function AddSchoolPage(){
    return(
        <main style={{maxWidth:720, margin:"0 auto", padding:"24px"}}>
            <SchoolForm/>
        </main>
    );
}