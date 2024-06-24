import './list.scss'
import Card from"../card/Card"
import {useLoaderData} from "react-router-dom";
import {useEffect} from "react";

function List({posts, savedList,callback}){

  return (
    <div className='list'>
      {posts.map(item=>(
        <Card key={item.id} card={item} savedList={savedList} callback={callback}/>
      ))}
    </div>
  )
}

export default List