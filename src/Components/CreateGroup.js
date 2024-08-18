import React, {useContext,useEffect,useState} from 'react';
import { myContext } from "./mainContainer";
import { useSelector} from "react-redux";
import Axios from "axios"
import { useNavigate } from 'react-router-dom';


function CreateGroup() {

  const navigate=useNavigate();
  const lightTheme=useSelector((state)=>state.themekey)
  const { refresh, setRefresh } = useContext(myContext);

  console.log("Context API : refresh : ", refresh);
  const [clicked,setClicked]=useState(false);
  const [selectedUser, setSelectedUser]=useState([]);
  const [inputValue,setInputValue]=useState('');
  const [name,setGroupName]=useState('');

  const [users, setUsers] = useState([]);
  const[userscopy,setUserscopy]=useState([]);
  // console.log("Conversations of Sidebar : ", conversations);
  const userData = JSON.parse(localStorage.getItem("userData"));

  const hadleSelectedUser=(user)=>{
    const updatedUsers = selectedUser.filter((selectedUser) => selectedUser!== user);
    const noSelectUser=users.filter((u)=> u!==user)
        setUsers(noSelectUser)
        setSelectedUser(updatedUsers);
        // Add the clicked user to the input value
        setInputValue((prevInputValue) => {
            if (prevInputValue) {
                return `${prevInputValue}, ${user.username}`;
            } else {
                return user.username;
            }
        });
  }

 
  const handleClick = ()=>{
    setClicked(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const inputUsers = inputValue.split(',').map(username => username.trim());
  
    const input = [];
    for (const inputuser of inputUsers) {
      console.log("Input User:", inputuser);
      const existingUser = userscopy.find(user => user.username === inputuser);
  
      if (existingUser) {
        input.push(existingUser._id);
      }
    }
    console.log("Input IDs:", input);
  
    try {
      const response = await Axios.post(`/createGroup?userId=${userData.user._id}`, {
        name,
        input
      });
      
      console.log(response.data);
  
      if (response.data.fullChat) {
        // Navigate to chat area
        navigate(
          "chat/" +
          response.data.fullChat._id +
          "&" +
          response.data.fullChat.group.name
        );
  
        // Optional: Fetch updated chat area data
        // Example:
        // fetchDataForChatArea();
        setRefresh(!refresh);
      }
    } catch (error) {
      console.log("An error occurred while submitting the detail", error);
    } 
  }
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the GET request with Axios, passing the request body
        const response = await Axios.get("/allUser", {
          params: { userId: userData.user._id }
        });
        console.log("Data refresh in sidebar ", response.data);
        setUsers(response.data);
        setUserscopy(response.data)

      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error
      }
    };

    fetchData();
  }, [refresh, userData.user._id]);




  if(!userData){
    console.log("userData not sent int the request")
    return
  }
   
  return (
    <div className={'Create-group' + (lightTheme ? "" : " dark")}>
    <input placeholder='Type the Group name' className='search-box '
    value={name}
     onChange={(event)=>{setGroupName(event.target.value)
    console.log(event.target.value)}} />
       
       <input placeholder='Please select at least two members' className='search-box'
       value={inputValue}
        onClick={handleClick}
        onChange={(event)=>setInputValue(event.target.value)}
       />
       <div className='container-gorupuser'>
       <div className='AdduserGroup'>
       {
         clicked && users.map((user,index)=>{
        return   <div key={index} className='userdisplay' onClick={()=>hadleSelectedUser(user)}>
           {user.username}
          

          
           </div>
         })
       }  
       </div> 

      </div>     
   
   
       
<button className='createGroup' type='submit' onClick={handleSubmit} >CreateGroup</button>
        {/* <IconButton style={{ color: 'black', backgroundColor:'aqua',border:'2px solid black', margin:'5px', }}>
                <AddIcon/>
            </IconButton> */}

    </div>
  )
}

export default CreateGroup;