const test = import.meta.env.VITE_MY_SECRET
export default () => <div className="bg-neutral-800">Home page {test}</div>