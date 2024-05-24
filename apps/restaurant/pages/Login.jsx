import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
const Layout = React.lazy(() => import("../Layout.jsx"));


const Login = () => {
  const [tableNumbers, setTableNumbers] = useState([]);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchTables = async () => {
      const tablesCollection = collection(firestore, 'tables');
      const tablesSnapshot = await getDocs(tablesCollection);
      const tablesList = tablesSnapshot.docs.map(doc => doc.data().number);
      setTableNumbers(tablesList);
    };

    fetchTables();
  }, []);

  return (
    <Layout>
      <div>
        <h1>Table Numbers</h1>
        <ul>
          {tableNumbers.map((number, index) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Login;