import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isNull } from 'lodash';
import Select from 'react-select';

import Online from 'app/assets/power-button-green.svg';
import Offline from 'app/assets/power-button-red.svg';

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
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5rem;
    padding: 0.5rem 1.7rem 0 1.7rem;
    & > h2 {
      font-size: 1.65rem;
      color: #aaa;
      margin: 0;
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

      & > div:last-child {
        & > div {
          display: flex;
          align-items: center;
          justify-content: center;
          & > button {
            padding: 1rem;
            background-color: grey;
            color: white;
            outline: none;
            border: none;
            cursor: pointer;
            margin: 1rem;

            &:hover {
              opacity: 0.8;
            }

            &:active, &:focus {
              background-color: black;
            }
          }
        }
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


    & > div.address-content, & > div.category {
      display: flex;
      justify-content: stretch;
      align-items: center;
      & > div:nth-child(1) {
        width: 6rem;
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
          color: #000000;
          font-size: 0.9rem;
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

    this.onNegaraChange = this.onNegaraChange.bind(this);
    this.onProvinsiChange = this.onProvinsiChange.bind(this);
    this.onKabupatenChange = this.onKabupatenChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);

    this.requestData = null;

    this.uangPasValue = null;
    this.roundedHalf = null;
    this.roundedFull = null;

    this.state = {
      negara: null,
      provinsi: null,
      kabupaten: null
    }
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
    const negara = this.state.negara;
    const kabupaten = this.state.kabupaten;
    const provinsi = this.state.provinsi;
    const { transactionData } = createTransactionPage;
    if(!isNull(negara)) {
      transactionData.negara = negara.label;
    }
    if(!isNull(kabupaten)) {
      transactionData.kabupaten = kabupaten.label;
    }
    if(!isNull(provinsi)) {
      transactionData.provinsi = provinsi.label;
    }
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
    const currentCategory = createTransactionPage.currentCategory;
    const categoryDiskon = currentCategory.value.diskon;
    total = total * (parseFloat(100-categoryDiskon)/100.0);
    totalDiskon += (totalDiskon * (parseFloat(categoryDiskon)/100.0));
    transactionData.kategori_wisatawan = currentCategory.value.id;
    transactionData.total = total;
    delete transactionData.wilayah;
    transactionData.total_diskon = totalDiskon;
    this.requestData = transactionData; 
    dispatch(continueToSummary());
  }

  onContinueToCheckout() {
    const { createTransactionPage, dispatch } = this.props;
    const total = this.requestData.total;
    this.uangPasValue = total;
    const totalString = total.toString();
    this.roundedFull = Math.ceil(total / (Math.pow(10, totalString.length -  1))) *  (Math.pow(10, totalString.length -  1));
    this.roundedHalf = (Math.floor(total / Math.pow(10, 3)) + 1) * 1000;

    dispatch(continueToCheckout());
  }

  onFinishTransaction() {
    const { dispatch, createTransactionPage, global } = this.props;
    this.requestData.email = this.emailRef.current.value;
    dispatch(postTransaction(this.requestData, global.online));
  }

  componentDidMount() { 
    const { dispatch } = this.props;
    dispatch(fetchInitialDataAction());
  }

  onCheckOutValueClick(type) {
    const  { dispatch } = this.props;
    switch(type) {
      case 'half': {
        this.totalAmountRef.current.value = this.roundedHalf;
        dispatch(setJumlahBayar(this.roundedHalf));
        break;
      }
      case 'full': {
        this.totalAmountRef.current.value = this.roundedFull;
        dispatch(setJumlahBayar(this.roundedFull));
        break;
      }
      default: {
        this.totalAmountRef.current.value = this.uangPasValue;
        dispatch(setJumlahBayar(this.uangPasValue));
        break;
      }

    }
  }

  componentWillUpdate(props) {
    const { dispatch, createTransactionPage } = props;
    if(createTransactionPage.isResetField) {
      this.totalAmountRef = React.createRef();
      this.emailRef = React.createRef();

      this.requestData = null;
      if(this.state.negara != null && this.state.provinsi != null && this.state.kabupaten != null) {
        this.setState({
          negara: null,
          provinsi: null,
          kabupaten: null
        })
      }
      setTimeout(() => {
        dispatch(resetField());
      }, 3000);
    }  
  }

  onNegaraChange(value) {
    this.setState({
      negara: value
    })
  }

  onProvinsiChange(value) {
    this.setState({
      provinsi: value
    })
  }

  onKabupatenChange(value) {
    this.setState({
      kabupaten: value
    })
  }

  onCategoryChange(value) {
    const { dispatch } = this.props;
    dispatch(setCategory(value))
  } 

  render() {
    const { createTransactionPage, dispatch, global } = this.props;
    console.log(createTransactionPage.currentCategory);
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
            <img src={global.online ? Online : Offline} height="30" />
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
                <div>
                  <div>
                    <button onClick={() => this.onCheckOutValueClick('full')}>
                      { convertToRupiah(this.roundedFull)}
                    </button>
                    { this.roundedFull != this.roundedHalf &&
                        <button onClick={() => this.onCheckOutValueClick('half')}>
                          { convertToRupiah(this.roundedHalf)}
                        </button>
                    }
                  </div>
                  <div>
                    <button onClick={() => this.onCheckOutValueClick('uangpas')}>
                      Uang pas
                    </button>
                  </div>
                </div>
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
                      <TextContent color={index % 2 != 0 ? '#111dbb' : '#fff' } backgroundColor={index % 2 == 0 ? '#111dbb' : '#fff' }>
                        <h5>{ tiket.wisatawan.nama }</h5>
                      </TextContent>
                    </div>
                  }
                  { createTransactionPage.mode == CREATE_TRANSACTION_MODE &&
                    <div>
                      <CircleButton
                        onClick={() => { dispatch(increaseAmountTicket(index))}}
                        backgroundColor={index % 2 == 0 ? '#111dbb' : '#fff' }
                        backgroundColorDisabled={index %2 == 0 ? '#525cdc' : '#eee'}
                        disabled={isNull(tiket.jumlah_tiket) ? false : tiket.jumlah >= tiket.jumlah_tiket}
                        color={index % 2 != 0 ? '#111dbb' : '#fff' }
                        backgroundColorActive={index % 2 == 0 ? '#1d2482' : '#ddd' }>+</CircleButton>
                    </div>
                  }
                 {
                  createTransactionPage.mode == CREATE_TRANSACTION_MODE &&
                   <div>
                    <CircleButton 
                      onClick={() => { dispatch(decreaseAmountTicket(index))}}
                      backgroundColor={index % 2 == 0 ? '#111dbb' : '#fff' }
                      backgroundColorDisabled={index %2 == 0 ? '#525cdc' : '#eee'}
                      disabled={tiket.jumlah <= 0}
                      color={index % 2 != 0 ? '#111dbb' : '#fff' } 
                      backgroundColorActive={index % 2 == 0 ? '#1d2482' : '#ddd' }>-</CircleButton>
                  </div>
                 }
                 { createTransactionPage.mode == SUMMARY_TRANSACTION_MODE 
                   && 
                   <div className="">
                     <TextContent color={index % 2 != 0 ? '#111dbb' : '#fff' } backgroundColor={index % 2 == 0 ? '#111dbb' : '#fff' }>
                      <h5>{ tiket.jumlah }</h5>
                    </TextContent>
                  </div>
                 } 
                {
                  (createTransactionPage.mode == CREATE_TRANSACTION_MODE || createTransactionPage.mode == SUMMARY_TRANSACTION_MODE)
                  && 
                  <div className="jumlah-per-tiket">
                    <TextContent color={index % 2 != 0 ? '#111dbb' : '#fff' } 
                      backgroundColor={index % 2 == 0 ? '#111dbb' : '#fff' }>
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
                  <Select 
                    placeholder="Negara"
                    onChange={this.onNegaraChange}
                    options={createTransactionPage.transactionData.wilayah.map((wil, index) => ({
                      label: wil.nama_negara,
                      value: index
                    }))}
                  />
                  <Select 
                    placeholder="Provinsi"
                    onChange={this.onProvinsiChange}
                    options={this.state.negara == null ? [] : 
                      createTransactionPage.transactionData.wilayah[this.state.negara.value].provinsis
                        .map((prov, index) => ({
                        label: prov.nama_provinsi,
                        value: index
                      }))}
                  />
                  <Select 
                    placeholder="Kabupaten"
                    onChange={this.onKabupatenChange}
                    options={this.state.negara == null || this.state.provinsi == null ? [] : 
                      createTransactionPage.transactionData.wilayah[this.state.negara.value].provinsis[this.state.provinsi.value]
                        .kabupaten.map((kab, index) => ({
                          label: kab.nama_kabupaten,
                          value: index
                        }))}
                  />
                </div>
              </div>
            }
            { createTransactionPage.mode == CREATE_TRANSACTION_MODE &&
              <div className="category">
                <div>
                  <h4>Kategori:</h4>
                </div>
                <div>
                  <Select 
                    placeholder="Kategori Wisatawan"
                    onChange={this.onCategoryChange}
                    defaultValue={createTransactionPage.currentCategory}
                    options={createTransactionPage.transactionData.kategori_wisatawan.map((kategori, index) => ({
                      value: kategori,
                      label: kategori.nama_kategori[0].toUpperCase() + kategori.nama_kategori.substr(1)
                    }))}
                  />
                </div> 
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
                backgroundColor="#2c53bb"
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
                  color="#ffffff" 
                  backgroundColor="#31981f"
                  backgroundColorDisabled="#dddddd"
                  backgroundColorActive="#111">
                  { createTransactionPage.mode == CREATE_TRANSACTION_MODE ? 'Lanjutkan Transaksi ->>' : 
                    (createTransactionPage.mode == FINISH_TRANSACTION_MODE ? 'Selesai' :
                      'Bayar ->>'
                    )
                  }
                </MediumRoundedButton>
             }
            </div>
          </div>
        </CreateTransactionPageWrapper>
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
