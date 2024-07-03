import './list.scss'
import Card from"../card/Card"
import {useLoaderData} from "react-router-dom";
import {useEffect} from "react";

function List({posts}){

  return (
      <div className='list'>
        {
          posts.length > 0 ?
              posts.map(item => (
                  <Card key={item.id} card={item}/>))
              : <div>내역이 없습니다.</div>
        }
      </div>
  );
}

export default List