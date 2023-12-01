import {useState, useEffect} from 'react';
import {collection, query, getDocs, where, doc, orderBy, onSnapshot, limit, startAfter} from 'firebase/firestore';
import { useFirebase } from '@quick-bite/shared/context/Firebase';
const test = import.meta.env.VITE_MY_SECRET
export default () => {
    const _fire = useFirebase();
    const db = _fire.db;
    console.log(db);
    const [menuItems,setMenuItems] = useState([])
   /* useEffect(()=>{
        const query=collection(db,"menu_items")
        return onSnapshot(query,(querySnapshot)=>{
            const items=[];
            querySnapshot.forEach((doc)=>{
                items.push({...doc.data()})
                return false;
            })
            setMenuItems(items)
        })
    },[])*/

    return <div>Home page {menuItems.length}</div>
}