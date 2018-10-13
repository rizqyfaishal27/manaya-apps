import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isNull } from 'lodash';

import {
  fetchInitialDataAction,
  increaseAmountTicket,
  decreaseAmountTicket,
  setCategory,
  continueToSummary,
  continueToCheckout,
  correction,
  continueToFinish,
  CREATE_TRANSACTION_MODE,
  SUMMARY_TRANSACTION_MODE,
  CHECKOUT_TRANSACTION_MODE,
  FINISH_TRANSACTION_MODE,
  setJumlahBayar,
  postTransaction,
  resetField,
  SUCCESS_TRANSACTION_MODE
} from 'app/containers/CreateTransactionPage/reducer';

import TextContent from 'app/components/TextContent';
import CircleButton from 'app/components/CircleButton';
import InputText from 'app/components/InputText';
import CircleRadio from 'app/components/CircleRadio';
import InputLabel from 'app/components/InputLabel';
import MediumRoundedButton from 'app/components/MediumRoundedButton';

import Bg from 'app/containers/LoginPage/bg.png';
import Loader from 'app/containers/LoginPage/loader.svg';

function convertToRupiah(angka) {
  angka = angka.toString().split('.')[0]
  let rupiah = '';    
  const angkarev = angka.toString().split('').reverse().join('');
  for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
  return rupiah.split('',rupiah.length-1).reverse().join('');
}


const LoaderWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;


const CreateTransactionPageWrapper = styled.div`
  padding-top: 2rem;
  box-sizing: border-box;
  position: relative;

  & > div.title-about {
    padding: 0.5rem 1.7rem 0 1.7rem;
    & > h2 {
      font-size: 1.65rem;
      color: #aaa;
      margin-bottom: 0;
    }
  }


  & > div.create-content {
    position: relative;
    margin: 1rem;
    background-color: #00bbff;
    color: #fff;
    padding: 1rem 0.5rem;
    padding-bottom: 2.5rem;

    & > div.success {
      display: flex;
      margin-top: 1rem;
      height: 7rem;
      justify-content: center;
      align-items: center;
    }

    & > div.kembalian {
      display: flex;
      margin-top: 1rem;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      & > div > h3 {
        text-align: center;
      }

      & > h3 {
        margin: 0;
        margin-top: 1rem;
        border-bottom: 1px solid #fff;
      }
    }
    & > div.total-checkout {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: stretch;
      align-items: center;
      & > div > h2 {
        text-align: center;
      }
    }

    & > h3 {
      color: #0006ffcf;
      border-bottom: 2px solid #0006ffcf;
      padding: 0.75rem 0.25rem;
      margin: 0;
    }

    & > p {
      line-height: 1.3remx;
    }


    & > div.address-content {
      display: flex;
      justify-content: stretch;
      align-items: center;
      & > div:nth-child(1) {
        padding: 0 1rem;
        align-self: flex-start;
      }
      & > div:nth-child(2) {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        & > div {
          margin: 0.5rem 0;

          & > input {
            background-color: transparent;
            text-align: left;
          }
        }
      }

    }

    & > div.radio {
      margin-top: 1rem;
      display: flex;
      justify-content: space-around;
      & > div {
        display: flex;
        justify-content: center;
        align-items: center;
        & > label {
          margin-left: 1rem;
        }
      }
    }

    & > div.total {
      display: flex;
      justify-contentL stretch;
      align-items: center;
      & > div > h3 {
        text-align: center;
      }
    }

    & > div:last-child {
      position: absolute;
      right: 1rem;
      bottom: -1.5rem;
      z-index: 11;
      & > button {
        margin-left: 1rem;
      }
    }

    & > div.detail-content {

      & > div {
        display: flex;
        align-items: center;
        margin: 1rem 0;
        justify-content: stretch;
        & > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          &:not(:last-child) {
            margin-right: 0.5rem;
          }
          &:nth-child(1) {
            width: 50%;
            display: flex;
            justify-content: stretch;
          }
          &:nth-child(2), &:nth-child(3) {
            width: 12%;
            display: flex;
            justify-content: center;
          }

          &:nth-child(3).jumlah-per-tiket {
            width: 38%;
            display: flex;
            justify-content: center;
          }

          &:nth-child(4) {
            width: 20%;
            & > div {
              padding-left: 1rem;
              margin-right: -30%;
            }
          }
        }
      }
    }

    & > div.create-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      & > h3 {
        border-bottom: 2px solid #fff;
        text-align: center;
        &:first-child {
          padding-right: 2rem;
        }
        &:last-child {
          padding-left: 2rem;
        }
      }
    }
  }


`;

class CreateTransactionPage extends Component {

  constructor(props) {
    super(props);
    this.provinsiRef = React.createRef();
    this.kabupatenRef = React.createRef();
    this.kecamatanRef = React.createRef();
    this.totalAmountRef = React.createRef();
    this.emailRef = React.createRef();

    this.onFinishTransaction = this.onFinishTransaction.bind(this);
    this.onContinueToSummary = this.onContinueToSummary.bind(this);
    this.onContinueToCheckout = this.onContinueToCheckout.bind(this);
    this.onContinueToFinish = this.onContinueToFinish.bind(this);
    this.onCorrectionClick = this.onCorrectionClick.bind(this);

    this.requestData = null;
  }

  onContinueToFinish() {
    const { dispatch } = this.props;
    this.requestData.jumlah_bayar = this.totalAmountRef.current.value;
    dispatch(continueToFinish());
  }

  onCorrectionClick() {
    const { dispatch } = this.props;
    dispatch(correction());
  }

  onContinueToSummary() {
    const { createTransactionPage, dispatch } = this.props;
    const kecamatan = this.kecamatanRef.current.value;
    const kabupaten = this.kabupatenRef.current.value;
    const provinsi = this.provinsiRef.current.value;
    const { transactionData } = createTransactionPage;
    transactionData.kecamatan = kecamatan;
    transactionData.kabupaten = kabupaten;
    transactionData.provinsi = provinsi;
    let total = 0;
    let totalDiskon = 0;
    transactionData.tiket.forEach(tiket => {
      const hargaTiket = tiket.harga_tiket;
      const jumlahTiket = tiket.jumlah;
      const diskon = tiket.wisatawan.diskon;
      const totalHargaTiket = (hargaTiket*jumlahTiket) * (parseFloat(100-diskon)/100.0);
      const totalDiskonTiket = (hargaTiket*jumlahTiket) * (parseFloat(diskon)/100.0);
      tiket.total = totalHargaTiket;
      total += totalHargaTiket; 
      totalDiskon += totalDiskonTiket;
    })

    transactionData.kategori_wisatawan.forEach(kategori => {
      if(kategori.active) {
        total = total * (parseFloat(100-kategori.diskon)/100.0);
        totalDiskon += (totalDiskon * (parseFloat(kategori.diskon)/100.0));
      }
    })  
    transactionData.total = total;
    transactionData.total_diskon = totalDiskon;
    this.requestData = transactionData; 
    dispatch(continueToSummary());
  }

  onContinueToCheckout() {
    const { createTransactionPage, dispatch } = this.props;
    dispatch(continueToCheckout());
  }

  onFinishTransaction() {
    const { dispatch, createTransactionPage } = this.props;
    this.requestData.email = this.emailRef.current.value;
    dispatch(postTransaction(this.requestData));
  }

  componentDidMount() { 
    const { dispatch } = this.props;
    dispatch(fetchInitialDataAction());
  }

  componentWillUpdate(props) {
    const { dispatch, createTransactionPage } = props;
    if(createTransactionPage.isResetField) {
      this.provinsiRef = React.createRef();
      this.kabupatenRef = React.createRef();
      this.kecamatanRef = React.createRef();
      this.totalAmountRef = React.createRef();
      this.emailRef = React.createRef();

      this.requestData = null;
      setTimeout(() => {
        dispatch(resetField());
      }, 3000);
    }  
  }

  render() {
    const { createTransactionPage, dispatch } = this.props;
    let isButtonEnabled = true;
    if(!isNull(createTransactionPage.transactionData) && !createTransactionPage.isLoading) {
      isButtonEnabled = createTransactionPage
                        .transactionData.tiket
                        .reduce((acc, curr) => acc && curr, isButtonEnabled)
    }
    if(createTransactionPage.mode == CHECKOUT_TRANSACTION_MODE) {
      isButtonEnabled = isButtonEnabled && (createTransactionPage.jumlah_bayar >= this.requestData.total);
    }
    return (
        (createTransactionPage.isLoading || isNull(createTransactionPage.transactionData)) ?
        <LoaderWrapper className="loader">
          <img src={Loader} alt="loading-icon" width="65" />
        </LoaderWrapper> :
        <CreateTransactionPageWrapper>
          <div className="title-about">
            <h2>{ createTransactionPage.mode == CREATE_TRANSACTION_MODE ? 'Transaksi baru' : 'Ringkasan Transaksi'}</h2>
          </div>

          <div className="create-content">
            {
               createTransactionPage.mode == FINISH_TRANSACTION_MODE &&
               <div className="kembalian">
                  <TextContent 
                    color="#fff" 
                    backgroundColor="#111dbb">
                    <h3>Uang Kembali : Rp.{convertToRupiah(Math.abs(this.requestData.total - this.requestData.jumlah_bayar))},00</h3>
                  </TextContent>
                  <h3>Pembayaran Tercatat</h3>
                  <div className="email-field">
                    <InputText
                      type="text"
                      color="#000 "
                      borderColor="#ddd" 
                      borderColorFocus="#fff"
                      placeholder="Email" 
                      inputRef={this.emailRef}/>
                  </div>
               </div>
            }
            {
              createTransactionPage.mode == SUCCESS_TRANSACTION_MODE &&
              <div className="success">
                <TextContent 
                  color="#fff" 
                  backgroundColor="#111dbb">
                  <h3>Transaksi Berhasil</h3>
                </TextContent>
              </div>
            }
            {
              createTransactionPage.mode == CHECKOUT_TRANSACTION_MODE &&
              <div className="total-checkout">
                <TextContent 
                  color="#fff" 
                  backgroundColor="#111dbb">
                  <h2>Total : Rp.{convertToRupiah(this.requestData.total)},00</h2>
                </TextContent>
                <InputText
                  type="text"
                  color="#000"
                  onChange={(e) => { dispatch(setJumlahBayar(e.target.value) )}}
                  borderColor="#ddd" 
                  borderColorFocus="#fff"
                  placeholder="Jumlah yang dibayar" 
                  inputRef={this.totalAmountRef}/>
              </div>
            }
            {
              (createTransactionPage.mode == CREATE_TRANSACTION_MODE ||
                createTransactionPage.mode == SUMMARY_TRANSACTION_MODE
              ) && 
              <div className="create-header">
                <h3>Wisatawan</h3>
                <h3>Jumlah</h3>
              </div>
            }
            <div className="detail-content">
              { createTransactionPage.transactionData.tiket.map((tiket, index) => 
                <div key={index} >
                  { (createTransactionPage.mode == CREATE_TRANSACTION_MODE || 
                    createTransactionPage.mode == SUMMARY_TRANSACTION_MODE)
                    &&  
                    <div>
                      <TextContent color="#fff" backgroundColor={index % 2 == 0 ? '#111dbb' : '#bb11ac' }>
                        <h5>{ tiket.wisatawan.nama }</h5>
                      </TextContent>
                    </div>
                  }
                  { createTransactionPage.mode == CREATE_TRANSACTION_MODE &&
                    <div>
                      <CircleButton
                        onClick={() => { dispatch(increaseAmountTicket(index))}}
                        backgroundColor={index % 2 == 0 ? '#111dbb' : '#bb11ac' }
                        backgroundColorDisabled={index %2 == 0 ? '#525cdc' : '#da53ce'}
                        disabled={isNull(tiket.jumlah_tiket) ? false : tiket.jumlah >= tiket.jumlah_tiket}
                        color="#fff" 
                        backgroundColorActive={index % 2 == 0 ? '#1d2482' : '#940b88' }>+</CircleButton>
                    </div>
                  }
                 {
                  createTransactionPage.mode == CREATE_TRANSACTION_MODE &&
                   <div>
                    <CircleButton 
                      onClick={() => { dispatch(decreaseAmountTicket(index))}}
                      backgroundColor={index % 2 == 0 ? '#111dbb' : '#bb11ac' }
                      backgroundColorDisabled={index %2 == 0 ? '#525cdc' : '#da53ce'}
                      disabled={tiket.jumlah <= 0}
                      color="#fff" 
                      backgroundColorActive={index % 2 == 0 ? '#1d2482' : '#940b88' }>-</CircleButton>
                  </div>
                 }
                 { createTransactionPage.mode == SUMMARY_TRANSACTION_MODE 
                   && 
                   <div className="">
                     <TextContent color="#fff" backgroundColor={index % 2 == 0 ? '#111dbb' : '#bb11ac' }>
                      <h5>{ tiket.jumlah }</h5>
                    </TextContent>
                  </div>
                 } 
                {
                  (createTransactionPage.mode == CREATE_TRANSACTION_MODE || createTransactionPage.mode == SUMMARY_TRANSACTION_MODE)
                  && 
                  <div className="jumlah-per-tiket">
                    <TextContent color="#fff" backgroundColor={index % 2 == 0 ? '#111dbb' : '#bb11ac' }>
                      <h5>{ createTransactionPage.mode == CREATE_TRANSACTION_MODE &&  tiket.jumlah }</h5>
                      <h5>{ createTransactionPage.mode == SUMMARY_TRANSACTION_MODE && 
                        `Rp. ${convertToRupiah(tiket.jumlah * tiket.harga_tiket)},00`}</h5>
                    </TextContent>
                  </div>
                }
                </div>
              )}
            </div>
            { createTransactionPage.mode == CREATE_TRANSACTION_MODE &&
              <div className="address-content">
                <div>
                  <h4>Asal:</h4>
                </div>
                <div>
                  <InputText
                    defaultValue={!isNull(this.requestData) ? this.requestData.provinsi : ''}
                    type="text"
                    color="#fff"
                    borderColor="#ddd" 
                    borderColorFocus="#fff"
                    placeholder="Provinsi" inputRef={this.provinsiRef}/>
                  <InputText
                    defaultValue={!isNull(this.requestData) ? this.requestData.kabupaten : ''}
                    type="text"
                    color="#fff"
                    borderColor="#ddd" 
                    borderColorFocus="#fff" 
                    placeholder="Kabupaten" inputRef={this.kabupatenRef}/>
                  <InputText
                    defaultValue={!isNull(this.requestData) ? this.requestData.kecamatan : ''}
                    type="text"
                    color="#fff"
                    borderColor="#ddd" 
                    borderColorFocus="#fff" 
                    placeholder="Kecamatan" inputRef={this.kecamatanRef}/>
                </div>
              </div>
            }
            { createTransactionPage.mode == CREATE_TRANSACTION_MODE &&
              <div className="radio">
                { createTransactionPage.transactionData.kategori_wisatawan.map((kategori, index) => 
                  <div key={index}>
                    <CircleRadio name="category" 
                      value={kategori.id} 
                      defaultChecked={kategori.active} 
                      onClick={() => { dispatch(setCategory(index))}}
                    />
                    <InputLabel>
                      { kategori.nama_kategori[0].toUpperCase() + kategori.nama_kategori.substr(1) }
                    </InputLabel>
                  </div>
                )}
              </div>
            }
            { createTransactionPage.mode == SUMMARY_TRANSACTION_MODE &&
              <div className="total">
                <TextContent 
                  color="#fff" 
                  backgroundColor="#111dbb">
                  <h3>Total : Rp.{convertToRupiah(this.requestData.total)},00</h3>
                </TextContent>
              </div>
            }
            <div>
              {(createTransactionPage.mode == SUMMARY_TRANSACTION_MODE || createTransactionPage.mode == CHECKOUT_TRANSACTION_MODE)
               && <MediumRoundedButton className="correction"
                onClick={this.onCorrectionClick}
                color="#ddd" 
                backgroundColor="#ec240d"
                backgroundColorDisabled="#d65445"
                backgroundColorActive="#ab3022">
                Koreksi
              </MediumRoundedButton>}
             { createTransactionPage.mode != SUCCESS_TRANSACTION_MODE &&
                <MediumRoundedButton
                  onClick={createTransactionPage.mode == CREATE_TRANSACTION_MODE 
                    ? this.onContinueToSummary : (createTransactionPage.mode == SUMMARY_TRANSACTION_MODE ?
                      this.onContinueToCheckout : ( createTransactionPage.mode == CHECKOUT_TRANSACTION_MODE ?
                        this.onContinueToFinish : this.onFinishTransaction
                      ))}
                  disabled={!isButtonEnabled}
                  color="#ddd" 
                  backgroundColor="#aaa"
                  backgroundColorDisabled="#ccc"
                  backgroundColorActive="#111">
                  { createTransactionPage.mode == CREATE_TRANSACTION_MODE ? 'Lanjutkan Transaksi ->>' : 
                    (createTransactionPage.mode == FINISH_TRANSACTION_MODE ? 'Selesai' :
                      'Bayar ->>'
                    )
                  }
                </MediumRoundedButton>
             }
            </div>
          </div></CreateTransactionPageWrapper>
    )
  }
} 

const mapStateToProps = (state) => ({
  global: state.get('global').toJS(),
  createTransactionPage: state.get('createTransactionPage').toJS()
});


const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateTransactionPage);
