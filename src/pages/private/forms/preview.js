import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';


import options from './options';

export const renderDataKK = (metadata, wilayah) => {

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            
            <Grid item xs={6} md={6}>
                <Typography> Provinsi </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> : {metadata.wil_provinsi.nama_provinsi} </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography>Kabupaten/Kota</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> : {metadata.wil_kabupaten.nama_kabupaten} </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> Kecamatan </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> : {metadata.wil_kecamatan.nama_kecamatan} </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> Desa/Kel </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography>: {metadata.wil_kelurahan.nama_kelurahan} </Typography>
            </Grid>

            <Grid item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> RW/Dusun </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> : {wilayah.id_rw_bkkbn} </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> RT</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> : {wilayah.id_rt_bkkbn} </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography>No. Rumah </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> : {wilayah.no_rmh} </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> No. Urut Keluarga </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> : {wilayah.no_urutkel} </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> No. Telepon/Hp </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> : {wilayah.no_telepon} </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> Jumlah Anggota Keluarga </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> : {wilayah.jumlah_keluarga} </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> Alamat </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
                <Typography> : {wilayah.alamat} </Typography>
            </Grid>
        </Grid>
    )
}


export const renderDataNIK = item => {

    return (<Grid container spacing={1}>
        <Grid item xs={12}>
            <Divider />
        </Grid>
        <Grid item xs={6} >
            <Typography variant="subtitle1" align="center" style={{ backgroundColor: "#038af680" }}>Anggota Keluarga {item.no_urutnik}</Typography>
        </Grid>

        <Grid item xs={12}>
            <Divider />
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> NIK </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {item.nik} </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> Nama </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {item.nama_anggotakel} </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> Jenis Kelamin </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {options.jenis_kelamin[item.jenis_kelamin]} </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> Tanggal Lahir </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {item.tgl_lahir} </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> Status Perkawinan </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {options.sts_kawin[item.sts_kawin]} </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> Usia Kawin Pertama </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {item.sts_kawin === "1" ? 0 : item.usia_kawin} </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> Memiliki Akta Lahir </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {options.sts_akta[item.sts_akta]} </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> Hubungan Dengan Kepala Keluarga </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {options.sts_hubungan[item.sts_hubungan]} </Typography>
        </Grid>

        {/* <Grid item xs={6} md={6}>
            <Typography> Hubungan Anak Dengan Ibu </Typography>
        </Grid> */}

        {/* <Grid item xs={6} md={6}>
            <Typography> : {options.sts_hubanak_ibu[item.sts_hubanak_ibu]} </Typography>
        </Grid> */}

        <Grid item xs={6} md={6}>
            <Typography> Kode Ibu Kandung </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {item.kd_ibukandung} </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> Agama </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {options.id_agama[item.id_agama]} </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> Pekerjaan </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {options.id_pekerjaan[item.id_pekerjaan]} </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> Pendidikan </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {options.jns_pendidikan[item.jns_pendidikan]} </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> Kepesertaan JKN/Asurasnsi </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {options.jns_asuransi[item.jns_asuransi]} </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> Keberadaa Anggota Keluarga </Typography>
        </Grid>

        <Grid item xs={6} md={6}>
            <Typography> : {options.keberadaan[item.keberadaan]} </Typography>
        </Grid>
    </Grid>)
}