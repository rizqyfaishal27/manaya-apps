import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import moment from 'moment';
import Online from 'app/assets/power-button-green.svg';
import Offline from 'app/assets/power-button-red.svg';
import { isNull } from 'lodash';
import { fetchTransactionRecordsFromLocalDBAction, onSelectDate, syncToServer } from 'app/containers/TransactionRecordsPage/reducer';
import Loader from 'app/containers/LoginPage/loader.svg';


function convertToRupiah(angka) {
  angka = angka.toString().split('.')[0]
  let rupiah = '';    
  const angkarev = angka.toString().split('').reverse().join('');
  for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
  return rupiah.split('',rupiah.length-1).reverse().join('');
}

const TransactionRecordsPageWrapper = styled.div`

  & > div {
    padding: 0.5rem 1.7rem 0 1.7rem;
  }
  & > div.title {
    margin-top: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #aaa;
  }

  & > div.choose-date {
    display: flex;
    justify-content: stretch;
    & > input { 
      box-sizing: border-box;
      width: 100%;
    }
  }

  & > div:last-child {
    display: flex;
    justify-content: center;
    align-items: center;
    & > button {
      padding: 1rem;
      background-color: grey;
      color: white;
      border: none;
      outline: none;
      border-radius: 7px;
      &:hover {
        opacity: 0.8;
      }
      &:active, &:focus {
        background-color: #000;
      }
      &:disabled {
        background-color: #eee;
      }
    }
  }

  & > div.syncDate {
    & > p {
      margin: 0;
    }
  }

  & > div.records {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
    & > div {
      width: 100%;
      max-height: 60vh;
      overflow-y: auto;
      & > div {
        display: flex;
        justify-content: flex-start;
        padding: 0.5rem 0;
        &:not(:last-child) {
          border-bottom: 1px solid #eee;
        }
        & > div {
          width: 50%;
        }
        & > div:last-child {
          justify-self: flex-end;
          & > p {
            text-align: right;  
          }
        }
        & > div:first-child {
          & > h4 {
            margin: 0;
          }
          & > p {
            margin: 0;
            color: green;
            font-size: 0.8rem;
            &.red {
              color: red;
            }
          }
        }
      }
    }
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;


class TransactionRecordsPage extends Component {


  constructor(props) {
    super(props);
    this.onSelectedDate = this.onSelectedDate.bind(this);
    this.onSyncClick = this.onSyncClick.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const today = moment().startOf('day').valueOf();
    dispatch(fetchTransactionRecordsFromLocalDBAction(today));
  }

  onSelectedDate(event) {
    const { dispatch } = this.props;
    const selectedDate = moment(event.target.value).startOf('day').valueOf();
    dispatch(fetchTransactionRecordsFromLocalDBAction(selectedDate));
  }

  onSyncClick() {
    const { dispatch } = this.props;
    dispatch(syncToServer());
  }

  render() {
    const { global, transactionRecordsPage } = this.props;
    const lastSyncedDate = window.localStorage.getItem('lastSyncedDate');
    let lastSyncedDateMomentObject = null;
    if(lastSyncedDate != undefined )   {
      lastSyncedDateMomentObject = moment.unix(lastSyncedDate / 1000).format('dddd, DD-MMM-YYYY HH:mm');
    }
    return transactionRecordsPage.isSync ? 
    <LoaderWrapper className="loader">
      <img src={Loader} alt="loading-icon" width="65" />
    </LoaderWrapper> :
    <TransactionRecordsPageWrapper>
      <div className="title">
        <h2>Riwayat Transaksi</h2>
        <img src={global.online ? Online : Offline} height="30" />
      </div>
      { lastSyncedDateMomentObject != null &&
        <div className="syncDate">
          <p>Last sync to server : {lastSyncedDateMomentObject}</p>
        </div>
      }
      <div className="choose-date">
        <input type="date" placeholder="Pilih tanggal" 
          defaultValue={moment().startOf('day').format("YYYY-MM-DD")}
          onChange={this.onSelectedDate}/>
      </div>
      <div className="records">
        {
          !isNull(transactionRecordsPage.currentRecords) && transactionRecordsPage.currentRecords.length <= 0 &&
          <p>No records found</p>
        }
        {
          !isNull(transactionRecordsPage.currentRecords) && transactionRecordsPage.currentRecords.length > 0 &&
          <div>
            { transactionRecordsPage.currentRecords.map((record, index) => (
                <div key={index}>
                  <div>
                    <h4>Total Rp.{ convertToRupiah(record.requestData.total)},00</h4>
                    <p className={record.is_synced ? 'green' : 'red'}>
                      { record.is_synced ? 'Stored in server' : 'Not yet stored in server'}
                    </p>
                  </div>
                  <div>
                    <p>Created at {moment(record.created_at).format("HH:mm")}</p>
                  </div>
                </div>
              ))}
          </div>
        }
      </div>
      <div>
        <button onClick={this.onSyncClick} 
          disabled={!global.online || transactionRecordsPage.totalNumberUnsync <= 0}>Sync to server</button>
      </div>
    </TransactionRecordsPageWrapper>
  }
}

const mapStateToProps = (state) => ({
  global: state.get('global').toJS(),
  transactionRecordsPage: state.get('transactionRecordsPage').toJS()
});

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionRecordsPage);
