
export function getNameIntial(name){
    const splitname = name.toUpperCase().split(' ');
    if(splitname.length > 1){
        return splitname[0][0] + splitname[1][0];
    }
    return splitname[0][0];
}
export function transformToArray(snapValue){
    return snapValue ? Object.keys(snapValue) : [];
}
export function transformArrayWithId(snapvalue){
    return snapvalue ? Object.keys(snapvalue).map((roomId)=>{
        return {
            ...snapvalue[roomId],
            id: roomId,
        }
    }) : [];
}

export async function getUserUpDate(userId,keyToUpdate,value,db){
    const updates = {}
    updates[`/profiles/${userId}/${keyToUpdate}`] = value;
    const getmsg = db.ref('/messages').orderByChild('author/uid').equalTo(userId).once('value');
    const getrooms = db.ref('/rooms').orderByChild('lastMessage/author/uid').equalTo(userId).once('value');
    const [mSnap, rSnap] = await Promise.all([getmsg, getrooms]);
    mSnap.forEach(msgSnap =>{
        updates[`messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
    });
    rSnap.forEach(roomSnap =>{
        updates[`rooms/${roomSnap.key}/lastMessage/author/${keyToUpdate}`] = value;
    });
    return updates;
}

export function groupBy(array, groupingKeyFn) {
    return array.reduce((result, item) => {
      const groupingKey = groupingKeyFn(item);
  
      if (!result[groupingKey]) {
        result[groupingKey] = [];
      }
  
      result[groupingKey].push(item);
  
      return result;
    }, {});
  }