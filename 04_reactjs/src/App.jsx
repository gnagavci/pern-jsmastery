import React from "react";
import Car from "./components/Car.jsx";

const App = () => {
    return (
        <div>
            <h1>Welcome to the Car Store</h1>
            <ul>
                <Car />
                <Car />
                <Car />
            </ul>
        </div>
    );
};

export default App;
