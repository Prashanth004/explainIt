import Downshift from 'downshift'

import React from 'react'

export default ({items, onChange})=> {
  return (
    <Downshift
      onChange={onChange}
      render={({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex,
      }) => (
        <div>
          <input {...getInputProps({placeholder: 'Favorite fruit ?'})} />
          {isOpen ? (
            <div style={{border: '1px solid #ccc'}}>
              {items
                .filter(
                  i =>
                    !inputValue ||
                    i.toLowerCase().includes(inputValue.toLowerCase()),
                )
                .map((item, index) => (
                  <div
                    {...getItemProps({item})}
                    key={item}
                    style={{
                      backgroundColor:
                        highlightedIndex === index ? 'gray' : 'white',
                      fontWeight: selectedItem === item ? 'bold' : 'normal',
                    }}
                  >
                    {item}
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      )}
    />
  )
}
// export default BasicAutocomplete

// function App() {
//   return (
//     <BasicAutocomplete
//       items={['apple', 'orange', 'carrot']}
//       onChange={selectedItem => console.log(selectedItem)}
//     />
//   )
// }


// export default () => {
//   return (
//     <div>
      
//     </div>
//   )
// }




