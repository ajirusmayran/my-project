import React, { useState, useEffect } from 'react';

//forms component
import Wilayah from './wilayah';
import Keluarga from './keluarga';
import KB from './kb';
import PK from './pk';
import Finish from './finish';

// material-ui components
import Slide from '@material-ui/core/Slide';
// import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import useStyles from './styles/index';

import { useParams, useHistory } from 'react-router-dom';
import { usePouchDB } from '../../../components/PouchDB/PouchDBProvider';
import { useSnackbar } from 'notistack';

import AppPageLoading from '../../../components/AppPageLoading';

import lodashGet from 'lodash/get';
import { countAge } from './pk/validation';

import beautyKB from './kb/beauty';
import beautyPK from './pk/beauty';
import beauty from './kb/beauty';

export default function EditForm(mode) {
    // console.log('here i am')
    const classes = useStyles();
    const params = useParams();
    const history = useHistory();
    const { user: { metadata }, dataKK, dataPK, dataKB, dataBkkbn } = usePouchDB();
    const [isFetching, setFetching] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [forms, setForms] = useState([{ type: 'wilayah' }]);
    const [formIndex, setFormIndex] = useState(0);
    const [done, setDone] = useState(false);
    const [slide, setSlide] = useState({
        direction: "left",
        in: true,
        navigationMode: "next"
    });

    const [isSaved, setSaved] = useState({
        local: false,
        remote: false
    })

    const [isSubmitting, setSubmitting] = useState({
        local: false,
        remote: false
    });

    const [wilayah, setWilayah] = useState({

    })

    const [keluarga, setKeluarga] = useState({

    })

    const [kb, setKB] = useState({

    })

    const [normalizeKB, setNormalizeKB] = useState({});

    const [pk, setPK] = useState({

    })

    const [normalizePK, setNormalizePK] = useState({});

    const [locationUser, setLocationUser] = useState([]);

    const fillForm = async (didCancel) => {
        setFetching(true);

        try {
            const kkDoc = await dataBkkbn.local.get(params._id);
            // const kbQuery = await dataBkkbn.local.find({
            //     selector: {
            //         No_KK: { $eq: params.no_kk }
            //     }
            // })
            // const pkQuery = await dataBkkbn.local.find({
            //     selector: {
            //         No_KK: { $eq: params.no_kk }
            //     }
            // })


            if (!didCancel) {

                if (kkDoc) {

                    const { data_nik, ...data_bkkbn } = kkDoc;

                    setWilayah(data_bkkbn);
                    let newkeluarga = {}
                    for (let i = 0; i < data_nik.length; i++) {

                        const id_anggota_kel = ('0' + data_nik[i].no_urutnik).slice(-2);
                        const currKeluarga = data_nik[i] || {}
                        newkeluarga[id_anggota_kel] = {

                            ...currKeluarga,
                            sts_hubungan: currKeluarga.sts_hubungan ? currKeluarga.sts_hubungan.toString() : "",
                            sts_kawin: currKeluarga.sts_kawin ? currKeluarga.sts_kawin.toString() : "",
                            jns_pendidikan: currKeluarga.jns_pendidikan ? currKeluarga.jns_pendidikan.toString() : "",
                            jns_asuransi: currKeluarga.jns_asuransi ? currKeluarga.jns_asuransi.toString() : "" ,
                            id_agama: currKeluarga.id_agama ? currKeluarga.id_agama.toString() : "",
                            id_pekerjaan: currKeluarga.id_pekerjaan ? currKeluarga.id_pekerjaan.toString() : "",
                            usia_kawin: currKeluarga.usia_kawin ? lodashGet(currKeluarga, 'usia_kawin', '').toString() : '',
                            // sts_hubanak_ibu: currKeluarga.sts_hubanak_ibu ? lodashGet(currKeluarga, 'sts_hubanak_ibu', '').toString() : '',
                            kd_ibukandung: currKeluarga.kd_ibukandung ? lodashGet(currKeluarga, 'kd_ibukandung', '').toString() : '0',
                            keberadaan: currKeluarga.keberadaan ? lodashGet(currKeluarga, 'keberadaan', '').toString() : '',
                        }


                    }
                    setKeluarga(newkeluarga);
                    console.log(newkeluarga);

                }

                if (kkDoc) {

                    const { data_kb, ...data_bkkbn } = kkDoc;

                    setKB(data_bkkbn);
                    let newkb = {};
                    for (let i = 0; i < data_kb.length; i++) {
                        let qid = ''

                        if (Object.keys(data_kb[i]).length === 0) {
                            let newIndex = i + 1
                            qid = `010${newIndex}`
                        } else {
                            let no_tes = parseInt(data_kb[i]._id.length) - 4
                            qid = (`${data_kb[i]._id}`).slice(no_tes);
                        }

                        //const qid = '0101'

                        const beauty = beautyKB[qid](data_kb[i]);
                        //const beauty = data_kb[i] || {}
                        newkb[qid] = {
                            _rev: kkDoc._rev,
                            ...beauty
                        }
                    }

                    setKB(newkb);
                    console.log(newkb)
                }



                if (kkDoc) {

                    const { data_pk, ...data_bkkbn } = kkDoc;

                    setPK(data_bkkbn);
                    let newpk = {};
                    for (let i = 0; i < data_pk.length; i++) {
                        let qid = ''

                        if (Object.keys(data_pk[i]).length === 0) {
                            let newIndex = i + 1
                            if (newIndex > 9) {
                                qid = `02${newIndex}`
                            } else {
                                qid = `020${newIndex}`
                            }
                        } else {
                            let no_tes = parseInt(data_pk[i]._id.length) - 4
                            qid = (`${data_pk[i]._id}`).slice(no_tes);
                        }


                        const beauty = beautyPK(qid, data_pk[i]);

                        newpk[qid] = {
                            _rev: kkDoc._rev,
                            ...beauty
                        }
                    }

                    setPK(newpk);
                    console.log(newpk)
                }

                setFetching(false);
            }

        } catch (e) {
            if (!didCancel) {
                enqueueSnackbar("Gagal memuat data: " + e.message, { variant: "error" })
                history.push('/')
            }
        }

    }

    useEffect(() => {
        if (params._id) {
            let didCancel = false;

            fillForm(didCancel);


            return () => {
                didCancel = true;
            }


        }

    }, [params._id]);

    useEffect(() => {
        if (wilayah.jumlah_keluarga) {
            const jumlah_keluarga = parseInt(wilayah.jumlah_keluarga);

            setKeluarga(keluarga => {
                let newkeluarga = {}
                for (let i = 1; i <= jumlah_keluarga; i++) {
                    const id_anggota_kel = ('0' + i).slice(-2);
                    const currKeluarga = keluarga[id_anggota_kel] || {}
                    newkeluarga[id_anggota_kel] = {
                        no_urutnik: i,
                        ...currKeluarga
                    }
                }
                setForms([
                    { type: 'wilayah' },
                    ...Object.keys(newkeluarga).map(key => ({ type: 'keluarga', id: key })),
                    { type: 'kb' },
                    { type: 'pk' }
                ])
                return newkeluarga;
            })

        }
    }, [wilayah.jumlah_keluarga])

    if (isFetching) {

        return <AppPageLoading />
    }

    const resetForm = () => {
        history.push('/form')
        // setSlide({
        //     direction: "right",
        //     in: false,
        //     navigationMode: "next"
        // });
        // setTimeout(() => {
        //     setForms([{ type: 'wilayah' }]);
        //     setFormIndex(0);
        //     setSlide({
        //         direction: "left",
        //         in: true,
        //         navigationMode: "next"
        //     })
        //     setWilayah({})
        //     setKeluarga({})
        //     setKB({})
        //     setNormalizeKB({})
        //     setPK({})
        //     setNormalizePK({})

        //     setDone(false);
        // }, 300)
    }
    const handleNext = () => {

        setSlide({
            direction: "right",
            in: false,
            navigationMode: "next"
        });
        setTimeout(() => {

            if (formIndex >= (forms.length - 1)) {
                setDone(true);
            } else {
                setFormIndex(index => index + 1);
            }
            setSlide({
                direction: "left",
                in: true,
                navigationMode: "next"
            })

        }, 300)

    }


    const handleBack = () => {
        setSlide({
            direction: "left",
            in: false,
            navigationMode: "back"
        });
        setTimeout(() => {

            setFormIndex(index => index - 1);
            setSlide({
                direction: "right",
                in: true,
                navigationMode: "back"
            })

        }, 300)
    }

    if (done) {
        return <><Slide direction={slide.direction} in={slide.in}>
            <div>
                <Finish
                    wilayah={wilayah}
                    keluarga={keluarga}
                    normalizePK={normalizePK}
                    normalizeKB={normalizeKB}
                    resetForm={resetForm}
                    mode="edit"
                    no_kk={params.no_kk}
                // pk={pk}
                // kb={kb}
                />
            </div>
        </Slide>
        </>
    }

    const f = forms[formIndex];

    // console.log(wilayah, keluarga, kb, pk)
    // console.log(normalizeKB);
    // console.log(normalizePK)

    const handleDraft = target => async (e) => {

        var alert = window.confirm("Apakah anda yakin untuk menyimpan data sementara ke Draft ?\nAnda akan diarahkan ke Daftar Draft");
        if (alert == true) {
            console.log('Ok')

            console.log('Masuk Draft', target)

        // put data utama to KK
        const dataKKUtama = {
            // _id: wilayah.no_kk,
            _id: `${Date.now().toString()}${metadata.name}`,
            user_name: metadata.name,
            id_prov: parseInt(metadata.wil_provinsi.id_provinsi),
            id_prov_depdagri: parseInt(metadata.wil_provinsi.id_provinsi_depdagri),
            id_kab: parseInt(metadata.wil_kabupaten.id_kabupaten),
            id_kab_depdagri: parseInt(metadata.wil_kabupaten.id_kabupaten_depdagri),
            id_kec: parseInt(metadata.wil_kecamatan.id_kecamatan),
            id_kec_depdagri: parseInt(metadata.wil_kecamatan.id_kecamatan_depdagri),
            id_kel: parseInt(metadata.wil_kelurahan.id_kelurahan),
            id_kel_depdagri: parseInt(metadata.wil_kelurahan.id_kelurahan_depdagri),
            ...wilayah,
            id_rw: wilayah.id_rw,
            id_rt: wilayah.id_rt,
            id_rw_bkkbn: wilayah.id_rw_bkkbn,
            id_rt_bkkbn: wilayah.id_rt_bkkbn,
            location: { locationUser },
        };
        const data_nik = Object.keys(keluarga).map(_id => {

            return {
                ...keluarga[_id],
                sts_hubungan: parseInt(keluarga[_id].sts_hubungan),
                sts_kawin: parseInt(keluarga[_id].sts_kawin),
                jns_pendidikan: parseInt(keluarga[_id].jns_pendidikan),
                jns_asuransi: parseInt(keluarga[_id].jns_asuransi),
                id_agama: parseInt(keluarga[_id].id_agama),
                id_pekerjaan: parseInt(keluarga[_id].id_pekerjaan),
                usia_kawin: parseInt(keluarga[_id].sts_kawin) === 1 ? 0 : parseInt(lodashGet(keluarga[_id], 'usia_kawin', 0)),
                // sts_hubanak_ibu: parseInt(lodashGet(keluarga[_id], 'sts_hubanak_ibu', 0)),
                kd_ibukandung: parseInt(lodashGet(keluarga[_id], 'kd_ibukandung', 0)),
                umur: countAge(keluarga[_id].tgl_lahir),
                keberadaan: parseInt(lodashGet(keluarga[_id], 'keberadaan', 0)),
            }
        })
        //simpan ke db local
        setSubmitting(curr => ({ ...curr, [target]: true }));
        try {
            const data_kb = Object.values(normalizeKB);
            const data_pk = Object.values(normalizePK);
            const status_draft = '1';

            const dataBkkbnAll = {
                ...dataKKUtama,
                periode_sensus: 2020,
                status_sensus: "",
                data_nik, data_kb, data_pk, status_draft,
            }

            await dataBkkbn[target].put(dataBkkbnAll);

            let message = mode === 'edit' ? `Data berhasil diperbarui` : `Data berhasil disimpan ke ${target} DB`
            enqueueSnackbar(message, { variant: "success" })

            const id = wilayah._id;

            // setSubmitting(curr => ({ ...curr, [target]: false }));
            setSaved(curr => ({ ...curr, [target]: true }));

            console.log('Edit list draft')
            history.push('/list-draft');

        } catch (e) {
            // setSubmitting(curr => ({ ...curr, [target]: false }));
            enqueueSnackbar(e.message, { variant: 'error' })
            if (e.message.includes("The database connection is closing")) {
                window.location.href = "/login"
            }
        }

        } else {
            console.log('Not Ok')
        }
    }

    return <Container maxWidth="md" className={classes.container}>
        <Slide direction={slide.direction} in={slide.in}>
            <div>
                {f.type === 'wilayah' &&

                    <Wilayah
                        mode="edit"
                        wilayah={wilayah}
                        setWilayah={setWilayah}
                        setFormIndex={setFormIndex}
                        handleNext={handleNext}
                        handleDraft={handleDraft}

                    />

                }

                {
                    f.type === 'keluarga' &&

                    <Keluarga
                        id={f.id}
                        setFormIndex={setFormIndex}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        keluarga={keluarga}
                        setKeluarga={setKeluarga}
                        formIndex={formIndex}
                        mode="edit"
                        no_kk={params.no_kk}
                        wilayah={wilayah}
                        handleDraft={handleDraft}
                    />

                }
                {
                    f.type === 'kb' &&
                    <KB
                        setFormIndex={setFormIndex}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        mainSlide={slide}
                        keluarga={keluarga}
                        wilayah={wilayah}
                        kb={kb}
                        setKB={setKB}
                        setNormalizeKB={setNormalizeKB}
                        mode="edit"
                        no_kk={params.no_kk}
                        handleDraft={handleDraft}
                    />

                }

                {
                    f.type === 'pk' &&
                    <PK
                        setFormIndex={setFormIndex}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        mainSlide={slide}
                        keluarga={keluarga}
                        wilayah={wilayah}
                        kb={kb}
                        pk={pk}
                        setPK={setPK}
                        setNormalizePK={setNormalizePK}
                        mode="edit"
                        no_kk={params.no_kk}
                        handleDraft={handleDraft}
                    />
                }
            </div>
        </Slide>

    </Container>
}
//