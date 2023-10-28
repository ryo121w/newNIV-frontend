import React from 'react';

// プロパティとしてonLogout関数を受け取ります。
// この関数は、ボタンがクリックされたときに実行されます。
function LogoutButton({ onLogout }) {
    return (
        <button onClick={onLogout}>Logout</button>
    );
}

export default LogoutButton;
