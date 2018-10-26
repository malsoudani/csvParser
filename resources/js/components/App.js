import React, { Component } from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            csv: '',
            returnedData: []
        }
        //binding because you can't just use "this" in js in a lifecycle method cuz it references the library class in this context.
        //Thanks Obama! and Scott and Brian lol.
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.renderCustomers = this.renderCustomers.bind(this)
    }
    onFormSubmit(e) {
        e.preventDefault();
        console.log(this.state.csv);
        axios.post('/csv-upload', {
            csv: this.state.csv
        }).then(resp => {
            this.setState({
                returnedData: resp.data
            });
        })
      }
    onChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        let reader = new FileReader();
        reader.onload = (e) => {
          this.setState({
            csv: e.target.result
          })
        };
        reader.readAsDataURL(files[0]);
    }
    // show repsonse code here
    renderCustomers () { // I kinda just dumped it on the screen. Sorry about that
    return this.state.returnedData.map(data => (
        <div className="card-body">
            <div key={data.cust_num} className="bg-info">
                Trans Type : {data.trans_type} <br />
                Trans Date : {data.trans_date} <br />
                Trans Time : {data.trans_time} <br />
                Cust # : {data.cust_num} <br />
                First Name : {data.cust_fname} <br />
                Email : {data.cust_email} <br />
                Phone : {data.cust_phone} <br />
                Invite Type : {data.invite} <br />
                Delivery Method : {data.delivery_method} <br />
                Sent/Not Sent : {data.delivery_status} <br />
                special Notes : {data.message} <br />
            </div>
        </div>

        ))
    }
    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">Upload a CSV and look out for the parser</div>

                            <div className="card-body">
                                <form onSubmit={this.onFormSubmit}>
                                    <div className="form-group">
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <input name="csv" type="file" className="custom-file-input" onChange={this.onChange} />
                                            <label name="csv" className="custom-file-label" htmlFor="inputGroupFile04">Choose file</label>
                                        </div>
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-primary" type="submit">Upload</button>
                                        </div>
                                        </div>
                                    </div>
                                </form>
                                <hr />
                                {this.renderCustomers()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
