import { useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { useLocation } from "react-router";


export default function() {

  const { groq } = useActionForm(api.services.groq);
  
  return (
    <h1>Hello</h1>


    );
}