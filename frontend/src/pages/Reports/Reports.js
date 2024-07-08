import React from 'react'
import './Reports.css'

function Reports() {
    return (
        <div className='d-flex justify-content-center mt-5'>
            <section className='reports-main'>

                <div className="card card-reports">
                    <div className="card-header text-start">
                        <h3 className='fw-light'>Report: CONFESS</h3>
                        <p>For user12</p>
                    </div>
                    <div className="card-body text-start">
                        <p className="card-title">
                            <i>Disclaimer: The evaluation is based on the information provided in the tool. No verifications were conducted.</i>
                        </p>
                        <p className="card-title mt-3">Total Number of Activities: 4</p>
                        <p className="mt-3">Total Turnover: 1,001 $ <br />Total CapEx: 1000 $ <br /> Total OpEx: 1000 $</p>
                        <p></p>
                        <p></p>
                    </div>
                </div>

                <section className='d-flex gap-3'>

                    <div className="card card-stats mt-5">

                        <div className="card-body text-start">
                            <h3>Turnover</h3>
                            <p className="card-title">
                                EU Taxonomy alignment for Clean Energy Activities
                            </p>

                            <div class="circle m-4">
                                <div class="circle-progress"></div>
                            </div>
                            <div className='row d-flex justify-content-bet align-items-center'>
                                <div className='col'>
                                    <p className="mt-3"><span className='green-dot'></span>Aligned</p>
                                    <p><span className='dark-dot'></span>Not aligned but eligible</p>
                                    <p><span className='grey-dot'></span>Not eligible</p>
                                </div>
                                <div className='col'>
                                    <p>600 $ (60%)</p>
                                    <p>600 $ (60%)</p>
                                    <p>600 $ (60%)</p>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className="card card-stats mt-5">
                        <div className="card-body text-start">
                            <h3>Turnover</h3>
                            <p className="card-title">
                                EU Taxonomy alignment for Clean Energy Activities
                            </p>

                            <div class="circle m-4">
                                <div class="circle-progress"></div>
                            </div>
                            <div className='row d-flex justify-content-bet align-items-center'>
                                <div className='col'>
                                    <p className="mt-3"><span className='green-dot'></span>Aligned</p>
                                    <p><span className='dark-dot'></span>Not aligned but eligible</p>
                                    <p><span className='grey-dot'></span>Not eligible</p>
                                </div>

                                <div className='col'>
                                    <p>600 $ (60%)</p>
                                    <p>600 $ (60%)</p>
                                    <p>600 $ (60%)</p>
                                </div>
                            </div>
                        </div>
                    </div>





                </section>

                <section className='d-flex gap-3'>

                    <div className="card card-stats mt-5">
                        <div className="card-body text-start">
                            <h3>OpEx</h3>
                            <p className="card-title">
                                EU Taxonomy alignment for Clean Energy Activities
                            </p>

                            <div class="circle m-4">
                                <div class="circle-progress"></div>
                            </div>
                            <div className='row d-flex justify-content-bet align-items-center'>
                                <div className='col'>
                                    <p className="mt-3"><span className='green-dot'></span>Aligned</p>
                                    <p><span className='dark-dot'></span>Not aligned but eligible</p>
                                    <p><span className='grey-dot'></span>Not eligible</p>
                                </div>

                                <div className='col'>
                                    <p>600 $ (60%)</p>
                                    <p>600 $ (60%)</p>
                                    <p>600 $ (60%)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card card-stats mt-5">
                        <div className="card-body text-start">
                            <h3># of Activities</h3>
                            <p className="card-title">
                                EU Taxonomy alignment for Clean Energy Activities
                            </p>

                            <div class="circle m-4">
                                <div class="circle-progress"></div>
                            </div>
                            <div className='row d-flex justify-content-bet align-items-center'>
                                <div className='col'>
                                    <p className="mt-3"><span className='green-dot'></span>Aligned</p>
                                    <p><span className='dark-dot'></span>Not aligned but eligible</p>
                                    <p><span className='grey-dot'></span>Not eligible</p>
                                </div>

                                <div className='col'>
                                    <p>600 $ (60%)</p>
                                    <p>600 $ (60%)</p>
                                    <p>600 $ (60%)</p>
                                </div>
                            </div>
                        </div>
                    </div>


                </section>

                <div className="card card-reports mt-5">
                    <div className="card-header text-start">
                        <h3 className='fw-light'>Activities in Detail</h3>
                    </div>
                    <div className="card-body text-start">
                        <p className="card-title">
                            <i>Disclaimer: The evaluation is based on the information provided in the tool. No verifications were conducted.</i>
                        </p>

                        <p>Legend</p>
                        <div className='col'>
                            <p className="mt-3"><span className='darkgreen-dot'></span>Aligned</p>
                            <p><span className='orage-dot'></span>Not aligned but eligible</p>
                            <p><span className='darkgrey-dot'></span>Not eligible</p>
                        </div>

                    </div>
                </div>


            </section>

        </div>
    )
}

export default Reports