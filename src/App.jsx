import React, { useEffect, useState } from 'react';
import './App.css';
import { APIURL, callApi, IMGURL } from './lib';

const App = () => {
    const [usersData, setUsersData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({
        _id: "",
        firstname: "",
        lastname: "",
        mobile: "",
        email: "",
        password: ""
    });

    useEffect(()=>{
        callApi("GET", APIURL + "users/getallusers", "", loadUsers);
    }, []);

    function loadUsers(res){
        setUsersData(res);
    }

    function deleteUser(_id){
        const ack = confirm("Do you want to delete? click OK");
        if(!ack)
            return;
        
        callApi("DELETE", APIURL + "users/deleteuser/" + _id, "", deleteResponse);
    }

    function deleteResponse(res)
    {
        alert(res.msg);
        callApi("GET", APIURL + "users/getallusers", "", loadUsers);
    }

    function editUser(index){
        setFormData(usersData[index]);
        setIsEdit(true);
    }

    function closeEdit(){
        setIsEdit(false);
    }

    function handleInput(e){
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    function updateUser(){
        callApi("PUT", APIURL + "users/updateuser", JSON.stringify(formData), updateResponse);
    }

    function updateResponse(res){
        alert(res.msg);
        setIsEdit(false);
        callApi("GET", APIURL + "users/getallusers", "", loadUsers);
    }

    function addNew(){
        setFormData({
            _id: "",
            firstname: "",
            lastname: "",
            mobile: "",
            email: "",
            password: ""
        });
        setIsEdit(true);
    }

function saveUser(){
        let data = JSON.stringify({
            firstname: formData.firstname,
            lastname: formData.lastname,
            mobile: formData.mobile,
            email: formData.email,
            password: formData.password
        });
        callApi("POST", APIURL + "users/saveuser", data, saveResponse);
    }
    function saveResponse(res){
        alert(res.msg);
        setIsEdit(false);
        callApi("GET", APIURL + "users/getallusers", "", loadUsers);
    }

    return (
        <div className='app'>
            <div className='header'>User Management</div>
            <div className='section'>
                <table>
                    <thead>
                        <tr>
                            <th style={{'width' : '50px'}}>S#</th>
                            <th style={{'width' : '150px'}}>First Name</th>
                            <th style={{'width' : '150px'}}>Last Name</th>
                            <th style={{'width' : '100px'}}>Mobile#</th>
                            <th style={{'width' : '250px'}}>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData.map((user, index)=>(
                            <tr key={index}>
                                <td style={{'textAlign' : 'center'}}>{index + 1}</td>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>{user.mobile}</td>
                                <td>{user.email}</td>
                                <td>
                                    <img src={IMGURL + "edit.png"} alt='' onClick={()=>editUser(index)} />
                                    <img src={IMGURL + "bin.png"} alt='' onClick={()=>deleteUser(user._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='footer'>
                <button onClick={()=>addNew()}>Add New</button>
                <span>Copyright @ 2026</span>
            </div>

            {isEdit && 
                <div className='popup'>'
                    <div className='panel'>
                        <span onClick={()=>closeEdit()}>&times;</span>
                        <h3>{formData._id === "" ? "Add New User" : "Edit User Information"}</h3>
                        <label>First Name</label>
                        <input type='type' name='firstname' value={formData.firstname} onChange={(e)=>handleInput(e)} />
                        <label>Last Name</label>
                        <input type='text' name='lastname' value={formData.lastname} onChange={(e)=>handleInput(e)} />
                        <label>Mobile Number</label>
                        <input type='text' name='mobile' value={formData.mobile} onChange={(e)=>handleInput(e)} />
                        <label>Email ID</label>
                        <input type='text' name='email' value={formData.email} onChange={(e)=>handleInput(e)} />
                        {formData._id !== "" ? 
                            <button onClick={()=>updateUser()}>Update</button> 
                            : 
                            <button onClick={()=>saveUser()}>Save</button>
                        }                               
                    </div>
                </div>
            }

        </div>
    );
}

export default App;
