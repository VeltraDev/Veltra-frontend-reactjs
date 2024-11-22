import React from 'react'
import Chart1 from './Chart/Chart1'
import ZChat1 from './Chart/Chart1'
import Chart2 from './Chart/Chart2'
import Chart3 from './Chart/Chart3'
import Chart4 from './Chart/Chart4'
import Chart5 from './Chart/Chart5'

function HomeDBPage() {
  return (
    <div>
      <ZChat1 />
      <div className='mt-5 grid grid-cols-3 gap-5'>   <Chart2 />
        <Chart3 />
        <Chart4 />
        <Chart5 /></div>
   
    </div>
  )
}

export default HomeDBPage
