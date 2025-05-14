/// <reference types="vite/client" />

declare module 'jspdf-autotable' {
    const autoTable: (doc: any, options: any) => void;
    export default autoTable;
  }
  
  declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
  }