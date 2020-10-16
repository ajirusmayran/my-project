import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// material ui components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DatePicker } from "@material-ui/pickers";


import { usePouchDB } from '../../../components/PouchDB/PouchDBProvider';
import lodashGet from 'lodash/get';
import { Swipeable } from 'react-swipeable';

//icons
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import SaveIcon from '@material-ui/icons/Save';

//styles
import useStyles from './styles/keluarga';

// //hooks
// import { usePouchDB } from '../../../components/PouchDB/PouchDBProvider';
import { useSnackbar } from 'notistack';


//app components
import { ScrollToTopWithoutRouter } from '../../../components/ScrollToTop';

//date utils
import formatDate from 'date-fns/format';
import parseDate from 'date-fns/parse';
import { countAge } from './pk/validation';

export const formatString = "dd-MM-yyyy";

function Keluarga({ wilayah, id, keluarga, setKeluarga, handleNext, handleBack, handleDraft, handleSegmen, formIndex, mode, normalizePK, normalizeKB, }) {
    const classes = useStyles();
    const nextRef = useRef(null);
    const backRef = useRef(null);
    // const { dataKK } = usePouchDB();
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState({

    })

    const { user: { metadata }, dataKK, dataPK, dataKB, dataBkkbn } = usePouchDB();
    const [locationUser, setLocationUser] = useState([]);

    const [isSomethingChange, setSomethingChange] = useState(false);

    const [isSubmitting, setSubmitting] = useState(false);

    const [qtyKeberadaan, setQtyKeberadaan] = useState([{ diDalamRumah: 0, diLuarRumah: 0, diLuarNegeri: 0 }])

    const [isSaved, setSaved] = useState({
        local: false,
        remote: false
    })

    const itemHubungan = ['Anak', 'Lainnya']

    const itemKeberadaan = ['Di Dalam Rumah', 'Di Luar Rumah', 'Di Luar Negeri']

    //reset error
    useEffect(() => {
        setError({})
    }, [id])

    // const qtyKeberadaan = [{ diDalamRumah: 0, diLuarRumah: 0, diLuarNegeri: 0 }]

    const handleCheckSegmen = async (event) => {
        const { value } = event.target;
        console.log(wilayah.status_draft, "status_draft")
        // const x = Object.keys(keluarga).length;
        const x = parseInt(wilayah.jumlah_keluarga);
        console.log(x, 'jml kel')
        if (value) {
            let val = parseInt(value);
            console.log(val, 'val parseint')
            if(x>1){
                (val>1) ? val = val+x-1 : val = val
            }
            if(x == 1 && val == 2){
                console.log("masuk if 1 2")
                alert("Data KB tidak tersedia");
            }else{
                console.log("masuk jmlklg"+x+"val"+val)
                handleSegmen(event, val)
            }
        }
    }

    const handleChange = (e) => {
        const { type, name, value } = e.target
        if (type === "number") {
            if (parseInt(value) < 0)
                return false;

            if (name === "nik" && value.length > 16) {
                return false;
            }
        }

        if (name === "keberadaan") {
            if (selectedKeluarga.keberadaan === "1") {
                qtyKeberadaan.diDalamRumah = qtyKeberadaan.diDalamRumah + 1
            } else if (selectedKeluarga.keberadaan === "2") {
                qtyKeberadaan.diLuarRumah = qtyKeberadaan.diLuarRumah + 1
            }
        }

        setKeluarga({
            ...keluarga,
            [id]: {
                ...keluarga[id],
                [name]: value
            }
        })

        setError({
            ...error,
            [name]: ""
        })

        setSomethingChange(true)
    }

    // console.log("qtyKeberadaan : ", qtyKeberadaan)

    const handleChangeUppercase = (e) => {
        const { type, name, value } = e.target

        if (keluarga["01"].jenis_kelamin === "1" && keluarga["01"].sts_kawin === "2" && id === "02") {
            setKeluarga({
                ...keluarga,
                [id]: {
                    ...keluarga[id],
                    ["jenis_kelamin"]: "2",
                    ["sts_kawin"]: "2"
                }
            })

        }

        setKeluarga((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [name]: value.toUpperCase()
            }
        }))

        setError({
            ...error,
            [name]: ""
        })

        setSomethingChange(true)
    }

    const handleUsiaKawin = (e) => {
        const { type, name, value } = e.target

        setKeluarga({
            ...keluarga,
            [id]: {
                ...keluarga[id],
                [name]: 0
            }
        })

        setError({
            ...error,
            [name]: ""
        })

        setSomethingChange(true)
    }

    const handleChangeStsAkta = (e) => {
        const { type, name, value } = e.target
        if (type === "number") {
            if (parseInt(value) < 0)
                return false;

            if (name === "nik" && value.length > 16) {
                return false;
            }
        }

        // set object Keluarga sts_hubungan == kepala keluarga
        // kondisi ini dijalanlan saat form keluarga yang pertama atau index 0

        if (id === "01") {
            setKeluarga({
                ...keluarga,
                [id]: {
                    ...keluarga[id],
                    ["sts_hubungan"]: "1"
                }
            })

        }

        if (keluarga["01"].jenis_kelamin === "1" && keluarga["01"].sts_kawin === "2" && id === "02") {
            setKeluarga({
                ...keluarga,
                [id]: {
                    ...keluarga[id],
                    ["sts_hubungan"]: "2"
                }
            })

        }

        setKeluarga((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [name]: value
            }
        }))

        setError({
            ...error,
            [name]: ""
        })

        setSomethingChange(true)
    }

    const handleChangeJnsAsuransi = (e) => {
        const { type, name, value } = e.target
        if (type === "number") {
            if (parseInt(value) < 0)
                return false;

            if (name === "nik" && value.length > 16) {
                return false;
            }
        }

        //jika hanya 1 orang langsung default keberadaan di dalam rumah
        if (id === "01" && wilayah.jumlah_keluarga === "1") {
            setKeluarga({
                ...keluarga,
                [id]: {
                    ...keluarga[id],
                    ["keberadaan"]: "1"
                }
            })
        }

        setKeluarga((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [name]: value
            }
        }))

        setError({
            ...error,
            [name]: ""
        })

        setSomethingChange(true)
    }

    const handleChangeHubungan = (e) => {
        const { type, name, value } = e.target
        if (type === "number") {
            if (parseInt(value) < 0)
                return false;

            if (name === "nik" && value.length > 16) {
                return false;
            }
        }

        //kondisi jika memilih sts_hubungan anak memiliki ibu
        if (keluarga['01'].sts_hubungan == "1" && keluarga['01'].sts_kawin == "2" && keluarga['01'].jenis_kelamin == "1") {
            setKeluarga({
                ...keluarga,
                [id]: {
                    ...keluarga[id],
                    ["kd_ibukandung"]: "2"
                }
            })
        }

        //kondisi jika memilih sts_hubungan anak dan tidak memiliki ibu maka value default 0
        if (keluarga['01'].sts_hubungan == "1" && (keluarga['01'].sts_kawin == "3" || keluarga['01'].sts_kawin == "4") && keluarga['01'].jenis_kelamin == "1") {
            setKeluarga({
                ...keluarga,
                [id]: {
                    ...keluarga[id],
                    ["kd_ibukandung"]: "0"
                }
            })
        }

        setKeluarga((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [name]: value
            }
        }))

        setError({
            ...error,
            [name]: ""
        })

        setSomethingChange(true)
    }


    const handleDateChange = name => newDate => {

        const value = formatDate(newDate, formatString)

        handleChange({ target: { value, name } })
    }


    const selectedKeluarga = keluarga[id];

    const lastKeluarga = ('0' + wilayah.jumlah_keluarga).slice(-2);

    const validate = () => {
        let newError = {};

        if (!selectedKeluarga.nama_anggotakel) {
            newError.nama_anggotakel = "Nama Lengkap wajib diisi";
        }
        else if (!selectedKeluarga.nama_anggotakel.match(/^[a-zA-Z\.\ ]+$/)) {
            newError.nama_anggotakel = "Nama tidak boleh mengandung Angka & Symbol";
        }
        // else if (selectedKeluarga.nama_anggotakel && selectedKeluarga.nama_anggotakel.length > 3) {
        //     newError.nama_anggotakel = "Nama Lengkap tidak boleh lebih dari 20 digit";
        // }

        if (!selectedKeluarga.nik) {
            newError.nik = "NIK wajib diisi";
        }
        else if (selectedKeluarga.nik.length !== 16) {
            newError.nik = "NIK harus 16 digit";
        }

        if (!selectedKeluarga.sts_hubungan) {
            newError.sts_hubungan = "Hubungan dengan Kepala Keluarga wajib diisi";
        }
        else if (selectedKeluarga.sts_hubungan === "1") {
            const cekKepalaKeluarga = Object.values(keluarga).find(kel => kel.sts_hubungan === "1");
            if (cekKepalaKeluarga && cekKepalaKeluarga.no_urutnik !== selectedKeluarga.no_urutnik) {
                newError.sts_hubungan = "Hanya boleh ada satu Kepala Keluarga";
            }
        }
        else if (selectedKeluarga.sts_hubungan === "2") {
            const cekIstri = Object.values(keluarga).find(kel => kel.sts_hubungan === "2")

            if (cekIstri && cekIstri.no_urutnik !== selectedKeluarga.no_urutnik) {
                newError.sts_hubungan = "Hanya boleh ada satu Istri";
            }
        }

        if (!selectedKeluarga.jenis_kelamin) {
            newError.jenis_kelamin = "Jenis Kelamin wajib diisi";
        }
        else if (selectedKeluarga.jenis_kelamin !== "2" && selectedKeluarga.sts_hubungan === "2") {
            newError.jenis_kelamin = "Istri harus berjenis kelamin perempuan";
        }

        // form kode ibu kandung
        if (selectedKeluarga.sts_hubungan === "3") {
            if (!selectedKeluarga.kd_ibukandung) {
                newError.kd_ibukandung = "Kode Ibu Kandung wajib diisi";
            } else {

                const cekIstri = Object.values(keluarga).find(kel => kel.no_urutnik === selectedKeluarga.kd_ibukandung);
                // if (cekIstri && cekIstri.sts_hubungan !== "2") {
                //     newError.kd_ibukandung = "Kode Ibu Kandung harus istri dari kepala keluarga atau wanita dengan status kepala keluarga";
                // }
                if (cekIstri && ['1', '3', '4'].includes(cekIstri.sts_hubungan) && cekIstri.jenis_kelamin === "1") {
                    newError.kd_ibukandung = "Kode Ibu Kandung harus istri dari kepala keluarga";
                }
                else if (cekIstri && ['3', '4'].includes(cekIstri.sts_hubungan) && cekIstri.jenis_kelamin === "2") {
                    newError.kd_ibukandung = "Kode Ibu Kandung harus istri dari kepala keluarga";
                }

            }
        }

        if (!selectedKeluarga.sts_akta) {
            newError.sts_akta = "Status Akta Lahir wajib diisi";
        }
        if (!selectedKeluarga.tgl_lahir) {
            newError.tgl_lahir = "Tanggal Lahir wajib diisi";
        }
        else if (selectedKeluarga.sts_hubungan === "1" && countAge(selectedKeluarga.tgl_lahir) < 10) {
            newError.tgl_lahir = "Umur Kepala Keluarga tidak boleh < 10 Tahun"
        }

        if (!selectedKeluarga.sts_kawin) {
            newError.sts_kawin = "Status Perkawinan wajib diisi";
        }
        else if (selectedKeluarga.sts_hubungan === "2" && selectedKeluarga.sts_kawin !== "2") {
            newError.sts_kawin = "Istri harus berstatus Kawin";
        }
        else if (selectedKeluarga.sts_hubungan === "3" && selectedKeluarga.sts_kawin !== "1") {
            newError.sts_kawin = "Anak tidak boleh berstatus Kawin/Cerai";
        }
        else if (selectedKeluarga.sts_hubungan === "4" && selectedKeluarga.sts_kawin === "2") {
            newError.sts_kawin = "Anggota keluarga lainnya tidak boleh berstatus Kawin";
        }
        else if (selectedKeluarga.sts_kawin !== "1" && countAge(selectedKeluarga.tgl_lahir) < 10) {
            newError.sts_kawin = "Status Kawin, Cerai Hidup/Mati tidak boleh berusia < 10 Tahun";
        }

        if (['2', '3', '4'].includes(selectedKeluarga.sts_kawin)) {

            if (!selectedKeluarga.usia_kawin) {
                newError.usia_kawin = "Usia Kawin Pertama wajib diisi";
            } else if (parseInt(selectedKeluarga.usia_kawin) < 7) {
                newError.usia_kawin = "Usia Kawin Pertama tidak boleh diisi < 7";
            } else if (selectedKeluarga.tgl_lahir && parseInt(selectedKeluarga.usia_kawin) >= countAge(selectedKeluarga.tgl_lahir)) {
                newError.usia_kawin = "Usia Kawin Pertama tidak boleh lebih besar dari umur";
            }



        }

        if (!selectedKeluarga.jns_pendidikan) {
            newError.jns_pendidikan = "Pendidikan wajib diisi";
        } else if ((countAge(selectedKeluarga.tgl_lahir) <= 7) && ['4', '5', '6', '7', '8', '9', '10'].includes(selectedKeluarga.jns_pendidikan)) {
            newError.jns_pendidikan = "usia harus > 7 tahun";
        }

        if (!selectedKeluarga.jns_asuransi) {
            newError.jns_asuransi = "Kepesertaan JKN wajib diisi";
        }

        if (!selectedKeluarga.id_agama) {
            newError.id_agama = "Agama wajib diisi";
        }

        if (!selectedKeluarga.id_pekerjaan) {
            newError.id_pekerjaan = "Pekerjaan wajib diisi";
        }
        else if (selectedKeluarga.id_pekerjaan !== "1" && countAge(selectedKeluarga.tgl_lahir) < 10) {
            newError.id_pekerjaan = "Usia pekerja tidak boleh < 10 tahun";
        }

        if (wilayah.jumlah_keluarga !== "1") {
            if (!selectedKeluarga.keberadaan) {
                newError.keberadaan = "Keberadaan Anggota Keluarga wajib diisi";
            }
        }

        if (id === lastKeluarga) {
            let x = 0;

            Object.keys(keluarga).forEach(function (key) {
                console.log("keluarga key :", keluarga[key]);
                if (keluarga[key].keberadaan === "1") {
                    x++
                }
            });

            if (x === 0) {
                newError.keberadaan = "Minimal terdapat 1 individu berada di dalam rumah";
            }
        }

        return newError;

    }

    const umurnikah = countAge(selectedKeluarga.tgl_lahir) + 1;


    const handleSubmit = async (e) => {
        e.preventDefault();



        const findErrors = validate();

        const errorValues = Object.values(findErrors);

        //jika jumlah keluarga nya hanya 1 orang maka langsung default di dalam rumah
        if (wilayah.jumlah_keluarga === "1") {
            setKeluarga({
                ...keluarga,
                [id]: {
                    ...keluarga[id],
                    ["keberadaan"]: "1"
                }
            })
        }

        if (errorValues.length > 0 && errorValues.some(err => err !== '')) {
            setError(findErrors);
        } else {
            if (!isSomethingChange) {
                return handleNext()
            }
            //simpan ke db local
            setSubmitting(true);
            try {

                setSubmitting(false)
                setSomethingChange(false);
                handleNext()
                console.log("Keluarga : ", keluarga)
                console.log("Jumlah Keluarga : ", wilayah.jumlah_keluarga)
            } catch (e) {
                setSubmitting(false);
                if (e.name === 'not_found') {
                    try {
                        // await dataKK.local.put({
                        //     _id: id,
                        //     type: 'anggota',
                        //     ...selectedKeluarga
                        // })

                        setSomethingChange(false);
                        handleNext()
                    } catch (e) {
                        enqueueSnackbar(e.message, { variant: 'error' })
                    }
                } else {
                    enqueueSnackbar(e.message, { variant: 'error' })
                }

            }


        }
    }

    return (
        <Swipeable
            trackMouse={true}
            onSwipedRight={(e) => {

                if (backRef) {
                    backRef.current.click()
                }
            }}
            onSwipedLeft={(e) => {
                if (nextRef) {

                    nextRef.current.click();
                }
            }}
        >
            <form onSubmit={handleSubmit} className={classes.form} noValidate>
                <ScrollToTopWithoutRouter />
                <Grid container spacing={3}>

                    <Grid item xs={12} className={classes.textCenter}>
                        <Typography variant="h5" component="h1">{mode === 'edit' ? `Edit Form Data Kependudukan` : 'Form Data Kependudukan'}</Typography>
                        {/* {mode === 'edit' && <Typography>No KK: {no_kk}</Typography>} */}

                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <TextField
                            disabled={isSubmitting}
                            fullWidth
                            variant="outlined"
                            placeholder={`No.${id}`}
                            name="no_anggotakel"
                            id="no_anggotakel"

                            onChange={handleChange}
                            error={error.no_anggotakel ? true : false}
                            helperText={error.no_anggotakel}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={8} md={5}>
                        <TextField
                            disabled={isSubmitting}
                            fullWidth
                            variant="outlined"
                            style={{ textTransform: 'uppercase' }}
                            placeholder="Nama Anggota Keluarga"
                            value={selectedKeluarga.nama_anggotakel || ''}
                            name="nama_anggotakel"
                            id="nama_anggotakel"
                            inputProps={{

                                min: 0,
                                maxLength: 20
                            }}
                            onChange={handleChangeUppercase}
                            error={error.nama_anggotakel ? true : false}
                            helperText={error.nama_anggotakel}
                        />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <TextField
                            disabled={isSubmitting}
                            fullWidth
                            variant="outlined"
                            placeholder="NIK"
                            value={selectedKeluarga.nik || ''}
                            name="nik"
                            id="nik"
                            type="number"
                            inputProps={{

                                min: 0
                            }}
                            onChange={handleChange}
                            error={error.nik ? true : false}
                            helperText={error.nik}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl
                            disabled={isSubmitting || (keluarga["01"].jenis_kelamin === "1" && keluarga["01"].sts_kawin === "2" && id === "02")}
                            variant="outlined" fullWidth error={error.jenis_kelamin ? true : false}>

                            <Select
                                id="jenis_kelamin"
                                value={selectedKeluarga.jenis_kelamin || (keluarga["01"].jenis_kelamin === "1" && keluarga["01"].sts_kawin === "2" && id === "02" && "2") || ""}
                                onChange={handleChange}
                                name="jenis_kelamin"
                                displayEmpty
                            >
                                <MenuItem value="">Pilih Jenis Kelamin</MenuItem>
                                <MenuItem value="1">Laki Laki</MenuItem>
                                <MenuItem value="2">Perempuan</MenuItem>
                            </Select>
                            <FormHelperText>{error.jenis_kelamin}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>

                        {/* <TextField
                            disabled={isSubmitting}
                            fullWidth
                            variant="outlined"
                            placeholder="Tanggal Lahir"
                            value={selectedKeluarga.tgl_lahir || ''}
                            name="tgl_lahir"
                            id="tgl_lahir"
                            type="date"
                            onChange={handleChange}
                            error={error.tgl_lahir ? true : false}
                            helperText={error.tgl_lahir}
                        /> */}
                        <DatePicker
                            autoOk
                            fullWidth
                            variant="inline"
                            format={formatString}
                            // label="Tanggal Lahir"
                            // placeholder="Tanggal Lahir"
                            name="tgl_lahir"
                            id="tgl_lahir"
                            disableFuture
                            inputVariant="outlined"
                            emptyLabel="Tanggal Lahir"
                            value={selectedKeluarga.tgl_lahir ? parseDate(selectedKeluarga.tgl_lahir, formatString, new Date()) : null}
                            error={error.tgl_lahir ? true : false}
                            helperText={error.tgl_lahir}
                            //value={selectedDate}
                            onChange={handleDateChange('tgl_lahir')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl
                            disabled={isSubmitting || (keluarga["01"].jenis_kelamin === "1" && keluarga["01"].sts_kawin === "2" && id === "02")}
                            variant="outlined" fullWidth error={error.sts_kawin ? true : false}>

                            <Select
                                id="sts_kawin"
                                // value={selectedKeluarga.sts_kawin || '' }
                                value={selectedKeluarga.sts_kawin || (keluarga["01"].jenis_kelamin === "1" && keluarga["01"].sts_kawin === "2" && id === "02" && "2") || ""}
                                onChange={handleChange}
                                name="sts_kawin"
                                displayEmpty
                            >
                                <MenuItem value="">Status Perkawinan</MenuItem>
                                <MenuItem value="1">Belum Kawin</MenuItem>
                                {
                                    (selectedKeluarga.jenis_kelamin === "1" || id !== "01") && <MenuItem value="2">Kawin</MenuItem>
                                }
                                <MenuItem value="3">Cerai Hidup</MenuItem>
                                <MenuItem value="4">Cerai Mati</MenuItem>


                            </Select>
                            <FormHelperText>{error.sts_kawin}</FormHelperText>
                        </FormControl>

                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            disabled={isSubmitting || !['2', '3', '4'].includes(selectedKeluarga.sts_kawin) || (keluarga["01"].jenis_kelamin === "1" && keluarga["01"].sts_kawin === "2" && id !== "01" && id !== "02")}
                            fullWidth
                            variant="outlined"
                            placeholder="Usia Kawin Pertama"
                            //value={selectedKeluarga.sts_kawin=="1" ? '' : selectedKeluarga.usia_kawin}
                            value={['2', '3', '4'].includes(selectedKeluarga.sts_kawin) ? selectedKeluarga.usia_kawin : ''}
                            name="usia_kawin"
                            id="usia_kawin"
                            type="number"
                            inputProps={{

                                min: 0,
                                max: umurnikah
                            }}
                            onChange={handleChange}
                            error={error.usia_kawin ? true : false}
                            helperText={error.usia_kawin}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl
                            disabled={isSubmitting}
                            variant="outlined" fullWidth error={error.sts_akta ? true : false}>

                            <Select
                                id="sts_akta"
                                value={selectedKeluarga.sts_akta || ''}
                                onChange={handleChangeStsAkta}
                                name="sts_akta"
                                displayEmpty
                            >
                                <MenuItem value="">Memiliki Akta Lahir</MenuItem>
                                <MenuItem value="1">Ya</MenuItem>
                                <MenuItem value="2">Tidak</MenuItem>
                            </Select>
                            <FormHelperText>{error.sts_akta}</FormHelperText>
                        </FormControl>

                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl
                            disabled={isSubmitting || id === "01" || (keluarga["01"].jenis_kelamin === "1" && keluarga["01"].sts_kawin === "2" && id === "02")}
                            variant="outlined" fullWidth error={error.sts_hubungan ? true : false}>

                            <Select
                                id="sts_hubungan"
                                value={(selectedKeluarga.sts_hubungan || (id === "01" && "1")) || (keluarga["01"].jenis_kelamin === "1" && keluarga["01"].sts_kawin === "2" && id === "02" && "2") || ""}
                                onChange={handleChangeHubungan}
                                name="sts_hubungan"
                                displayEmpty
                            >
                                <MenuItem value="">Hubungan Dengan Kepala Keluarga</MenuItem>
                                {/* default halaman pertama kepalakeluarga */}
                                {
                                    id === "01" && <MenuItem value="1">Kepala Keluarga</MenuItem>
                                }

                                {/* jika halaman pertamanya seorang laki2 dan berstatus kawin maka default halaman ke duanya harus istri */}
                                {
                                    keluarga["01"].jenis_kelamin === "1" && keluarga["01"].sts_kawin === "2" && id === "02" &&
                                    <MenuItem value="2">Istri</MenuItem>
                                }

                                {/* jika halaman keduanya default istri maka halaman seterusnya harus anak dan lain2 */}
                                {
                                    keluarga["01"].jenis_kelamin === "1" && keluarga["01"].sts_kawin === "2" && id > "02" &&
                                    itemHubungan.map((val, index) => {
                                        return (<MenuItem value={`${index + 3}`}>{val}</MenuItem>)
                                    })
                                }

                                {/* jika halaman pertama seorang perempuan dan berstatus kawin halaman ke dua dan seterusnya harus anak dan lain2 */}
                                {
                                    keluarga["01"].jenis_kelamin === "2" && keluarga["01"].sts_kawin === "2" && id >= "02" &&
                                    itemHubungan.map((val, index) => {
                                        return (<MenuItem value={`${index + 3}`}>{val}</MenuItem>)
                                    })
                                }

                                {/* jika halaman pertamanya cerai maka yg tampil di halaman ke dua dan seterusnya harus anak dan lain2 */}
                                {
                                    (keluarga["01"].sts_kawin === "3" || keluarga["01"].sts_kawin === "4") && id >= "02" &&
                                    itemHubungan.map((val, index) => {
                                        return (<MenuItem value={`${index + 3}`}>{val}</MenuItem>)
                                    })
                                }

                                {/* jika halaman pertamanya belum kawin maka yg tampil di halaman ke dua dan seterusnya lain2 */}
                                {
                                    keluarga["01"].sts_kawin === "1" && id >= "02" &&
                                    <MenuItem value="4">Lainnya</MenuItem>
                                }

                            </Select>
                            <FormHelperText>{error.sts_hubungan}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl
                            disabled={isSubmitting || selectedKeluarga.sts_hubungan !== "3"}
                            variant="outlined" fullWidth error={error.kd_ibukandung ? true : false}>

                            <Select
                                // disabled={isSubmitting || selectedKeluarga.sts_hubungan !== "3"}
                                id="kd_ibukandung"
                                value={
                                    (selectedKeluarga.sts_hubungan == "3" && keluarga["02"].sts_hubungan === "2") ?
                                        selectedKeluarga.kd_ibukandung :
                                        (selectedKeluarga.sts_hubungan == "3" && keluarga["01"].jenis_kelamin === "2") ?
                                            selectedKeluarga.kd_ibukandung :
                                            (selectedKeluarga.sts_hubungan == "3" && keluarga["01"].jenis_kelamin === "1") ?
                                                '0' : ''
                                }
                                onChange={handleChange}
                                name="kd_ibukandung"
                                displayEmpty
                            >

                                <MenuItem value="">Kode Ibu Kandung</MenuItem>
                                {
                                    Object.values(keluarga).map(kel => {
                                        if (Object.keys(keluarga).length > 1) {
                                            if (kel.sts_hubungan == "1" && kel.sts_kawin == "2" && kel.jenis_kelamin == "1")
                                                return (
                                                    <MenuItem key={keluarga['02'].no_urutnik} value={keluarga['02'].no_urutnik}>{keluarga['02'].no_urutnik} - {keluarga['02'].nama_anggotakel}</MenuItem>
                                                )

                                            if (kel.sts_hubungan == "1" && kel.sts_kawin !== "2" && kel.jenis_kelamin == "2")
                                                return (
                                                    <MenuItem key={keluarga['01'].no_urutnik} value={keluarga['01'].no_urutnik}>{keluarga['01'].no_urutnik} - {keluarga['01'].nama_anggotakel}</MenuItem>
                                                )

                                            if (kel.sts_hubungan == "1" && (kel.sts_kawin == "3" || kel.sts_kawin == "4") && kel.jenis_kelamin == "1")
                                                // return (
                                                //     <MenuItem value="0">00</MenuItem>
                                                // )
                                                return null
                                        }
                                    })
                                }
                                <MenuItem value="0">00</MenuItem>



                            </Select>
                            <FormHelperText>{error.kd_ibukandung}</FormHelperText>
                        </FormControl>

                    </Grid>


                    <Grid item xs={12} sm={6} md={4}>

                        <FormControl
                            disabled={isSubmitting}
                            variant="outlined" fullWidth error={error.id_agama ? true : false}>

                            <Select
                                id="id_agama"
                                value={selectedKeluarga.id_agama || ''}
                                onChange={handleChange}
                                name="id_agama"
                                displayEmpty
                            >
                                <MenuItem value="">Agama</MenuItem>
                                <MenuItem value="1">Islam</MenuItem>
                                <MenuItem value="2">Kristen</MenuItem>
                                <MenuItem value="3">Katolik</MenuItem>
                                <MenuItem value="4">Hindu</MenuItem>
                                <MenuItem value="5">Budha</MenuItem>
                                <MenuItem value="6">Konghucu</MenuItem>
                                <MenuItem value="7">Penghayat Kepercayaan</MenuItem>
                                <MenuItem value="8">Lainnya</MenuItem>
                            </Select>
                            <FormHelperText>{error.id_agama}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>

                        <FormControl
                            disabled={isSubmitting}
                            variant="outlined" fullWidth error={error.id_pekerjaan ? true : false}>

                            <Select
                                id="id_pekerjaan"
                                value={selectedKeluarga.id_pekerjaan || ''}
                                onChange={handleChange}
                                name="id_pekerjaan"
                                displayEmpty
                            >
                                <MenuItem value="">Status Pekerjaan</MenuItem>
                                <MenuItem value="1">Tidak/Belum Bekerja</MenuItem>
                                <MenuItem value="2">Petani</MenuItem>
                                <MenuItem value="3">Nelayan</MenuItem>
                                <MenuItem value="4">Pedagang</MenuItem>
                                <MenuItem value="5">Pejabat Negara</MenuItem>
                                <MenuItem value="6">PNS/TNI/POLRI</MenuItem>
                                <MenuItem value="7">Pegawai Swasta</MenuItem>
                                <MenuItem value="8">Wiraswasta</MenuItem>
                                <MenuItem value="9">Pensiunan</MenuItem>
                                <MenuItem value="10">Pekerja Lepas</MenuItem>
                            </Select>
                            <FormHelperText>{error.id_pekerjaan}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl
                            disabled={isSubmitting}
                            variant="outlined" fullWidth error={error.jns_pendidikan ? true : false}>

                            <Select
                                id="jns_pendidikan"
                                value={selectedKeluarga.jns_pendidikan || ''}
                                onChange={handleChange}
                                name="jns_pendidikan"
                                displayEmpty
                            >
                                <MenuItem value="">Pendidikan</MenuItem>
                                <MenuItem value="1">Tidak/Belum Sekolah</MenuItem>
                                <MenuItem value="2">Tidak Tamat SD/Sederajat</MenuItem>
                                <MenuItem value="3">Masih SD/Sederajat</MenuItem>
                                <MenuItem value="4">Tamat SD/Sederajat</MenuItem>
                                <MenuItem value="5">Masih SLTP/Sederajat</MenuItem>
                                <MenuItem value="6">Tamat SLTP/Sederajat</MenuItem>
                                <MenuItem value="7">Masih SLTA/Sederajat</MenuItem>
                                <MenuItem value="8">Tamat SLTA/Sederajat</MenuItem>
                                <MenuItem value="9">Masih PT/Akademi</MenuItem>
                                <MenuItem value="10">Tamat PT/Akademi</MenuItem>


                            </Select>
                            <FormHelperText>{error.jns_pendidikan}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>

                        <FormControl
                            disabled={isSubmitting}
                            variant="outlined" fullWidth error={error.jns_asuransi ? true : false}>

                            <Select
                                id="jns_asuransi"
                                value={selectedKeluarga.jns_asuransi || ''}
                                onChange={handleChangeJnsAsuransi}
                                name="jns_asuransi"
                                displayEmpty
                            >
                                <MenuItem value="">Kepesertaan JKN/Asurasnsi Kesehatan lainnya</MenuItem>
                                <MenuItem value="1">BPJS-PBI/Jamkesmas/Jamkesda</MenuItem>
                                <MenuItem value="2">BPJS-Non PBI</MenuItem>
                                <MenuItem value="3">Swasta</MenuItem>
                                <MenuItem value="4">Tidak Memiliki</MenuItem>
                            </Select>
                            <FormHelperText>{error.jns_asuransi}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl
                            disabled={isSubmitting || wilayah.jumlah_keluarga === "1"}
                            variant="outlined" fullWidth error={error.keberadaan ? true : false}>

                            <Select
                                id="keberadaan"
                                value={((wilayah.jumlah_keluarga === "1" && "1")) || selectedKeluarga.keberadaan || ""}
                                onChange={handleChange}
                                name="keberadaan"
                                displayEmpty
                            >
                                {/* <MenuItem value="">Keberadaan anggota keluarga</MenuItem>
                                <MenuItem value="1">Di Dalam Rumah</MenuItem>
                                <MenuItem value="2">Di Luar Rumah</MenuItem>
                                <MenuItem value="3">Di Luar Negeri</MenuItem> */}

                                <MenuItem value="">Keberadaan anggota keluarga</MenuItem>
                                {
                                    wilayah.jumlah_keluarga === "1" && <MenuItem value="1">Di Dalam Rumah</MenuItem>
                                }
                                {
                                    wilayah.jumlah_keluarga !== "1" &&
                                    itemKeberadaan.map((val, index) => {
                                        return (<MenuItem value={`${index + 1}`}>{val}</MenuItem>)
                                    })
                                }

                            </Select>
                            <FormHelperText>{error.keberadaan}</FormHelperText>
                        </FormControl>

                    </Grid>

                    <Grid item xs>
                        <Button
                            ref={backRef}
                            // disabled={!isSomethingChange || isSubmitting}
                            onClick={() => {
                                handleBack()
                            }}><ChevronLeft className={classes.iconLeft} /> Sebelumnya </Button>
                    </Grid>

                    <Grid item xs>
                        {
                            mode === "edit" && wilayah.status_draft && wilayah.status_draft === '1' ?
                                <> <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleDraft('local')}
                                    disabled={isSubmitting.local || isSaved.local}
                                >
                                    <SaveIcon className={classes.iconLeft} /> Save as Draft </Button> </> : <></>
                        }

                        {
                            mode == "edit" && (wilayah.status_draft == undefined || wilayah.status_draft == '2') ?
                                <>
                                    <FormControl
                                        variant="outlined">
                                        <Select
                                            id=""
                                            value=""
                                            name="segmen"
                                            onChange={handleCheckSegmen}
                                            displayEmpty
                                        >
                                            <MenuItem value=""> Segmen </MenuItem>
                                            <MenuItem value="0"> Wilayah </MenuItem>
                                            <MenuItem value="1"> Keluarga </MenuItem>
                                            <MenuItem value="2"> KB </MenuItem>
                                            <MenuItem value="3"> PK </MenuItem>
                                        </Select>
                                    </FormControl>
                                </> : <></>
                        }

                        {
                            mode !== "edit" ?
                                <> <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleDraft('local')}
                                    disabled={isSubmitting.local || isSaved.local}
                                >
                                    <SaveIcon className={classes.iconLeft} /> Save as Draft </Button> </> : <></>
                        }
                    </Grid>

                    <Grid item>
                        {isSubmitting && <CircularProgress size={14} />}
                        <Button
                            ref={nextRef}
                            disabled={isSubmitting}
                            type="submit">Selanjutnya <ChevronRight className={classes.iconRight} /></Button>
                    </Grid>

                </Grid>

            </form></Swipeable>
    )
}


Keluarga.propTypes = {
    id: PropTypes.string.isRequired,
    keluarga: PropTypes.object.isRequired,
    setKeluarga: PropTypes.func.isRequired
}

export default Keluarga;
//