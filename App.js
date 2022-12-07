import React, { useEffect, useState } from "react";
import { Spacing, TextField, Paper, Avatar, Link, Checkbox, FormControlLabel, createTheme, ThemeProvider, Typography, Box, Button, AppBar, Card, CardContent, CardMedia, CssBaseline, Grid, Toolbar, Container } from "@material-ui/core";
import ConnectMetamask from './NavBar';
import voter from './images/voter.png'
import useStyles from './styles';
import { ethers } from "ethers";
import getBlockchain from "./Ethereum";
import { TextField, Grid, InputAdornment, IconButton } from '@material-ui/core';

const { Identity } = require("@semaphore-protocol/identity");
const { Group } = require("@semaphore-protocol/group");
const { generateProof, packToSolidityProof, verifyProof } = require("@semaphore-protocol/proof");

const group = new Group();
const users = [];

const App = () => {

    const [accounts, setAccounts] = useState([]);
    const [_merkleRoot, setMerkleTreeRoot] = useState('');
    const [_nullifierHash, setNullifierHash] = useState('');
    const [_proof, setProof] = useState('');
    const [contract, setContract] = useState(undefined);

    const classes = useStyles();

    useEffect(() => {
        const init = async () => {
            const { contract } = await getBlockchain();
            setContract(contract);

        }
        init();

    }, [_identity]);


    const commit = async () => {

        users.push({
            identity: new Identity(),
            username: ethers.utils.formatBytes32String("anon1")
        })

        console.log(users)

        users.push({
            identity: new Identity(),
            username: ethers.utils.formatBytes32String("anon2")
        })

        group.addMember(users[0].identity.generateCommitment())
        group.addMember(users[1].identity.generateCommitment())

        for (let i = 0; i < group.members.length; i++) {
            await contract.methods.joinGroup(group.members[i], users[i].username).send(
                { from: accounts[0] }
            );

        }

        const greeting = ethers.utils.formatBytes32String("Hello World")

        const fullProof = await generateProof(users[1].identity, group, 42, greeting)
        const solidityProof = packToSolidityProof(fullProof.proof)

        console.log('root: ', fullProof.publicSignals.merkleRoot)
        console.log('fullProof.publicSignals.nullifierHash: ', fullProof.publicSignals.nullifierHash)
        console.log(solidityProof)

    }

    const greet = async (e) => {
        e.preventDefault();

        const greeting = ethers.utils.formatBytes32String("Hello World");

        await contract.methods.greet(
            greeting,
            _merkleRoot,
            _nullifierHash,
            _proof
        ).send(
            { from: accounts[0] }
        );
    }

    return (
        <div>
            <Container maxWidth="lg">
                <ConnectMetamask accounts={accounts} setAccounts={setAccounts} setIsConnected={setIsConnected} setContract={contract} />
                <Container component="main" maxWidth="xs">
                    <Paper className={classes.paper} elevation={3}>
                        <Avatar src={voter} className={classes.avatar}></Avatar>
                        <Typography component="h1" variant="h5">Vote</Typography>

                        <form className={classes.form} onSubmit={greet}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        name='vote'
                                        onChange={(e) => setVote(ethers.utils.formatBytes32String(e.target.value.toString()))}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label='vote'
                                        autoFocus
                                        type='text'
                                    />
                                    <TextField
                                        className={classes.textField}
                                        name='merkleTreeRoot'
                                        onChange={(e) => setMerkleTreeRoot(e.target.value)}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label='merkleTreeRoot'
                                        autoFocus
                                        type='text'
                                    />
                                    <TextField
                                        className={classes.textField}
                                        name='nullifier'
                                        onChange={(e) => setNullifierHash(e.target.value)}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label='nullifierHash'
                                        autoFocus
                                        type='text'
                                    />
                                    <TextField
                                        className={classes.textField}
                                        name='nullifier'
                                        onChange={(e) => setProof(e.target.value)}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label='nullifierHash'
                                        autoFocus
                                        type='text'
                                    />
  


                                </Grid>
                            </Grid>
                            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                cast vote
                            </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Button onClick>
                                        Don't have identity
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Container>
                <Button variant="contained" onClick={commit}>
                    commit
                </Button>
                <Button variant="contained" onClick={greet}>
                    greet
                </Button>
            </Container>

        </div>
    )
}

export default App;









