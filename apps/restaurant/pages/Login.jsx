import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const Login = () => {
  const [tableNumbers, setTableNumbers] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      const tablesCollection = collection(db, 'tables');
      const tablesSnapshot = await getDocs(tablesCollection);
      const tablesList = tablesSnapshot.docs.map(doc => doc.data().number);
      setTableNumbers(tablesList);
    };

    fetchTables();
  }, []);

  return (
    <div>
      <h1>Table Numbers</h1>
      <ul>
        {tableNumbers.map((number, index) => (
          <li key={index}>{number}</li>
        ))}
      </ul>
    </div>
  );
};

export default Login;