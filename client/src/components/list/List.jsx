import './list.scss'
import Card from"../card/Card"
import {useLoaderData} from "react-router-dom";
import {useEffect} from "react";

function List({posts}){

  return (
    <div className='list'>
      {posts.map(item=>(
        <Card key={item.id} card={item}/>
      ))}
    </div>
  )
}

export default List