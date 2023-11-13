"use strict";

/* Package System */
import React from "react";
import Router, { withRouter } from "next/router";
import { connect } from "react-redux";

/* Package Application */
import Moment from "moment";
import { handleFailure, handleSuccess, setFormLayout,setDetailLayout,setImportLayout } from "@features/Status";
import { updateProfile } from "@features/Account";
import {
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  FormHelperText,
  Stack,
  Autocomplete,
  NativeSelect,
  Box,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
  Tabs,
  Tab,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import _, { isArray } from "lodash";
import { postApi, fetchApi, putApi, cleanEmpty, uppercaseStr } from "@utils/Helper";
import moment from 'moment'
import Spinkit from "@views/Admin/Components/Spinkit";
import Link from "next/link";

class FormLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      module: props.router.query?.pages[0] ?? "",
      id: props.stateStatus?.formLayout?.id ??props.stateStatus?.detailLayout?.id?? "",
      preview: "",
      isLoading: false,
      data: {},
      values: {
        round_range:[
          {}
        ],
        sponsors:[
          {
            sponsor_type_id:'',
            quanity: undefined,
            sponsor_items:[]
          }
        ]
      },
      errors: [],
      channels: [],
      isAlert: {
        status: false,
        type: "",
        message: "",
      },
      readOnly:[],
      prevValues:{},
      tab:0,
      checked:[],
      hiddenField:[]
    };
  }
  
  async componentDidMount() {
    this._isMounted = true;

    //Check readOnly field
    let readOnlyField = this.props.fields.filter(field => field?.readOnly).map(field => field.key);
    let hiddenField = this.props.fields.filter(field => field?.hidden).map(field => field.key);
    let prevValues = this.state.prevValues;
    if (this.props.stateStatus?.formLayout?.type == "Profile") {
      
      let _result;
      _result = await fetchApi(
        process.env.PREFIX_API + "me",
        this.props.stateAccount.access_token
      );

      if (typeof _result === "object") {
        (await this._isMounted) &&
          this.setState({ values: { ..._result?.result } });
      }
    }

    if (this.state.id != "" && !this.props?.router?.query?.token) {
      let _result;
      let _url = process.env.PREFIX_API + this.state.module;
      _result = await fetchApi(
        _url + "/" + this.state.id,
        this.props.stateAccount.access_token
      );
      if (typeof _result === "object" && _result?.data) {
        if (_result?.data?.image) {
          this._isMounted &&
            this.setState({
              preview: {
                ...this.state.preview,
                image: process.env.CDN_URL_S3 + _result?.data?.image,
              },
            });
        }
        if (_result?.data?.images) {
          this._isMounted &&
            this.setState({
              preview: {
                ...this.state.preview,
                images: _result?.data?.images,
              },
            });
        }
        if (_result?.data?.file_link) {
          this._isMounted &&
            this.setState({
              preview: {
                ...this.state.preview,
                file: _result?.data?.file_link,
              },
            });
        }
        if (_result?.data?.source_name) {
          prevValues.source_name = _result?.data?.source_name
        }
        if (_result?.data?.category_id) {
          prevValues.category_id = _result?.data?.category_id
        }
        this._isMounted && this.setState({ values: { ..._result.data } })
      } else {
        this._isMounted && this.props.handleFailure("Server error");
        this.props.setFormLayout(false);
        this.props.setImportLayout(false);

      }
    }

    // Get Data
    if (this.props.getData && !this.props?.router?.query?.token) {
      for (const [key, value] of Object.entries(this.props.getData)) {
        let _url =
          value.indexOf("http") >= 0 ? value : process.env.PREFIX_API + value;
        let optional_headers = {}
        let _data = await fetchApi(_url, this.props.stateAccount.access_token,optional_headers);
        if (_data?.status == "success") {
          let _findIndex = _.findIndex(this.props.fields, { key: key });
          let _defaultValue =
            this.props?.fields[_findIndex]?.values &&
            this.props?.fields[_findIndex]?.values.length > 0
              ? this.props?.fields[_findIndex]?.values[0].value
              : null;
          let _defaultData = this.state.values[key]
            ? this.state.values[key]
            : _defaultValue != null
            ? _defaultValue
            : this.props.fields[_findIndex]?.type == 'select_multi' ? (_data.items ? [_data?.items[0]?.id] :[_data?.data[0]?.id]) :  (_data.items ? _data?.items[0]?.id : _data?.data[0]?.id ) ?? "";
          this._isMounted &&
            this.setState(
              {
                data: { ...this.state.data, [key]: _data.items ? _data.items : _data.data},
                values: { ...this.state.values, [key]: _defaultData },
              }
            );
        }
      }
    }
    this.setState({ readOnly: readOnlyField,hiddenField });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleFormLayout = () => {
    let _value = !this.props.stateStatus.formLayout;
    this.props.setFormLayout(_value);
  };
  handleDetailLayout = () => {
    let _value = !this.props.stateStatus.detailLayout;
    this.props.setDetailLayout(_value);
  };

  handleOpenAlert = (type, message) => {
    this.setState({
      isAlert: {
        ...this.state.isAlert,
        status: true,
        type: type,
        message: message,
      },
    });
  };

  handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ isAlert: { ...this.state.isAlert, status: false } });
  };


  handleChangeValue = async (e) => {
    let _value =
    e.target.type === "checkbox" ? e.target.checked : e.target.value;
    let _err = this.state.errors;
    let _findKey = _.findIndex(_err, { key: e.target?.name });
    let _fieldKey = _.findIndex(this.props.fields, { key: e.target?.name });
    if (_value != "") {
      delete _err[_findKey];
      this.setState({ errors: _err });
    }
    if(e.target.type == 'number' && (e.target.max || e.target.min)){
      const val = parseInt(_value);
      if(parseInt(e.target.max) && parseInt(e.target.max) < val) _value = parseInt(e.target.max);
      if(parseInt(e.target.min) && parseInt(e.target.min) > val) _value = parseInt(e.target.min);
    }
    if (this.props.fields[_fieldKey]?.capitalizeContent == true) {
      _value = uppercaseStr(_value)
    }
    this.setState({
      values: { ...this.state.values, [e.target.name]: _value },
    });
  };

  handleChangeSelect = async (e) => {
    let _value = e.target.value;
    let _err = this.state.errors;
    let _findKey = _.findIndex(_err, { key: e.target?.name });
    let _fieldKey = _.findIndex(this.props.fields, { key: e.target?.name });
    if (_value != "") {
      delete _err[_findKey];
      this.setState({ errors: _err });
    }
    if (this.props.fields[_fieldKey]?.onForChange) {
      let _func = this.props.fields[_fieldKey]?.onForChange?.func;
      let _result = await _func(_value,this.props.stateAccount.access_token);
      this._isMounted &&
        this.setState(
          {
            data: {
              ...this.state.data,
              [this.props.fields[_fieldKey]?.onForChange["key"]]: _result,
            },
          },
          () => {
            if (_result && _result.length > 0)
              this._isMounted &&
                this.setState({
                  values: {
                    ...this.state.values,
                    [this.props.fields[_fieldKey]?.onForChange["key"]]:
                      _result[0].id,
                  },
                });
          }
        );
    }
    await this.setState({
      values: {
        ...this.state.values,
        [e.target.name]:
          typeof _value === "string" ? _value.split(",") : [..._value],
      },
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    let _form = document.getElementById("form");
    let _data = new FormData(_form);
    if (
      this.state.isLoading == false
      //   &&
      //   cleanEmpty(this.state.errors).length <= 0
    ) {
      this.setState({ isLoading: true });
      let _obj = {};
      _data.forEach((val, key) => {
        let _findIndex = _.findIndex(this.props.fields, { key: key });
        if (this.props?.fields[_findIndex]?.type == "status") {
          val = this.state.values[key] == true || val == "on" ? true : false;
        }
        if (this.state.values[key] && this.props?.fields[_findIndex]?.type == "date") {
          val = new Date(this.state.values[key]);
        }
        if (this.state.values[key] && this.props?.fields[_findIndex]?.type == "dateTime") {
          val = new Date(this.state.values[key]);
        }
        if (this.props?.fields[_findIndex]?.type == "autoComplete" || this.props?.fields[_findIndex]?.type == "select_multi") {
          val = this.state.values[key] ? this.state.values[key] : val;
        }
        if (this.state.module == "websites") {
          if (key == "website_content" && this.state.id !== "" && this.state.prevValues?.website_content && val !== this.state.prevValues.website_content) {
            _obj.website_content_changed = true;
          }
        }
        if (key == "source_name" && this.state.id !== "" && this.state.prevValues?.source_name && val !== this.state.prevValues.source_name) {
          _obj.source_name_changed = true;
        }
        if (key == "category_id" && this.state.id !== "" && this.state.prevValues?.category_id && val !== this.state.prevValues.category_id) {
          _obj.category_id_changed = true;
        }
        _obj[key] = val && val ? val : undefined;
      });
      // if(this.state.id&&!_obj['status']) _obj['status'] = false;
      
      if (this.props.stateStatus?.formLayout?.type == "Profile" && _obj["avatar"] == "")
        delete _obj["avatar"];

      //Remove object empty
      if (this.state.id == "") {
        for (let _key in _obj) {
          if (_.isString(_obj[_key]) == true && _.isEmpty(_obj[_key]) == true) {
            delete _obj[_key];
          }
        }
      } else {
        for (let _key in _obj) {
          if (_.isString(_obj[_key]) == true && _.isEmpty(_obj[_key]) == true) {
            _obj[_key] = null;
          }
        }

      }

      //Remove object empty
      if(this.props?.fieldNotForm)
      for (let _key in _obj) {
        if (this.props.fieldNotForm.includes(_key)) {
          delete _obj[_key];
        }
      }
      let _result;
      let _url =  process.env.PREFIX_API + this.state.module;
      if (this.props.stateStatus?.formLayout?.type == "Profile") {
        _result = await putApi(
          process.env.PREFIX_API + "me",
          _obj,
          this.props.stateAccount.access_token
        );
      } else if (this.state.id == "")
        _result = await postApi(
          _url,
          _obj,
          this.props.stateAccount.access_token
        );
      else if (this.props.stateStatus.formLayout.type == "Profile") {
        _result = await putApi(
          process.env.PREFIX_API + "me",
          _obj,
          this.props.stateAccount.access_token
        )
          .then((resp) => resp)
          .catch((e) => e);
      } else {
        _result = await putApi(
          _url + "/" + this.state.id,
          _obj,
          this.props.stateAccount.access_token
        )
          .then((resp) => resp)
          .catch((e) => e);
      }
      if (_result == "" || _result?.status == "success") {
        if (
          this.state.id == "" &&
          this.props.stateStatus?.formLayout?.type &&
          this.props.stateStatus?.formLayout?.type != "Profile"
        ) {
          this._isMounted && this.props.handleSuccess("Thêm mới thành công");
          setTimeout(() => {
            this._isMounted && this.setState({ isLoading: false, errors: [] });
            Router.push("/" + this.state.module);
          }, 1000);
        } else {
          this._isMounted && this.props.handleSuccess("Cập nhật thành công");
          setTimeout(() => {
            this._isMounted && this.setState({ isLoading: false, errors: [] });
            if (!this.props.stateStatus?.formLayout?.type) {
              Router.push("/" + this.state.module);
            }
            //this.props.stateStatus.formLayout.get();
          }, 1000);
          if (
            this.props.stateStatus?.formLayout?.type &&
            this.props.stateStatus?.formLayout?.type == "Profile"
          ) {
            this.props.updateProfile({
              nickname: this.state.values?.nickname ?? "",
              avatar: this.state.preview,
            });
          }
        }
        this.props.setFormLayout(false);
        this.props.setImportLayout(false);
      } else {
        if (_result.response?.data) {
          if (typeof _result.response.data.errors?.msg === "string") {
            this._isMounted &&
              this.props.handleFailure(_result.response.data.errors.msg);
          } else {
            this._isMounted &&
              this.setState({ errors: _result.response.data.errors });
          }
        } else {
          this._isMounted &&
            this.props.handleFailure("Server error");
        }
        this._isMounted && this.setState({ isLoading: false });
      }
    }
  };


  combineChildren = (data, parentName = '') => {
    const result = [];
  
    data.forEach(parent => {
      if (parent.children && parent.children.length > 0) {
        parent.children.forEach(children => {
          result.push({...children, name: parent.name +' - '+ children.name})
        })
      }
    });
  
    return result;
  }

  handleToggle = (key)=>{
    const poll_item = this.state.checked?.find(pitem=>pitem == key);
    if(poll_item){
      this.setState({
        ...this.state,
        checked : [...this.state.checked?.filter(poll=>poll != key)]
      })
    }
    else {
      // this.state.values.poll_item_ids.push(key)
      this.setState({
        ...this.state,
        checked : [...this.state.checked,key]
      })
    }
  }

  showFields = (field) => {
    let _field;
    let _findKey;
    let _errArr = this.state.errors;
    let _readOnly = ((this.state.id != "" || this.props.stateStatus?.formLayout?.type == "Profile")&& field?.updateDisable) ?? (this.props?.detail ?? this.state.readOnly?.includes(field.key));
    if (_errArr?.length > 0)
      _findKey = _.findIndex(_errArr, { key: field.key });
      let { preview } = this.state;
    switch (field.type) {
      case "status":
        _field = (
          <Switch
            name={field.key}
            onChange={this.handleChangeValue}
            checked={
              this.state?.values[field.key] ??
              (this.state.id == "" ? field.defaultValue : false)
            }
            size="small"
            className="ms-4 mb-1"
            disabled={_readOnly}
          />
        );
        break;
      case "radio":
        _field = (
          <FormControl component="fieldset">
            <RadioGroup
              id={field.key}
              aria-label={field.key}
              onChange={this.handleChangeValue}
              value={this.state?.values[field.key] ?? field.defaultValue}
              name={field.key}
              className="formCheckInline"
            >
              {field.values &&
                field.values.map((value) => (
                  <FormControlLabel
                    disabled={_readOnly}
                    key={value}
                    value={value}
                    control={<Radio />}
                    label={value}
                  />
                ))}
            </RadioGroup>
          </FormControl>
        );
        break;
      case "select":
        _field = (
          <FormControl fullWidth className="selectCustom">
            <Select
              value={
                this.state?.values[field.key] ??
                (field?.values && field?.values?.length > 0
                  ? field?.values[0]?.value
                  : "")
              }
              onChange={this.handleChangeValue}
              name={field.key}
              error={_findKey >= 0 ? true : false}
              disabled={_readOnly}
            >
              {field.values &&
                field.values.map((v) => (
                  <MenuItem key={v.value} value={v.value}>
                    {v.label}
                  </MenuItem>
                ))}
              {this.state.data[field.key] &&
                this.state.data[field.key].map((value) => (
                  <MenuItem key={value.id} value={value.id}>
                    {field?.mapField
                      ? value[field?.mapField]
                      : value.name
                      ? value.name
                      : value.title
                      ? value.title
                      : value.full_name}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>
              {_findKey >= 0 ? _errArr[_findKey].msg : ""}
            </FormHelperText>
          </FormControl>
        );
        break;
      case "select_multi":
        let value = this.state?.values[field.key] ?? [];
        if(!isArray(this.state?.values[field.key]))
          value = [this.state?.values[field.key]];
        _field = (
          <FormControl fullWidth className="selectCustom">
            <Select
              displayEmpty
              multiple
              value={value}
              onChange={this.handleChangeSelect}
              name={field.key}
              error={_findKey >= 0 ? true : false}
              disabled={_readOnly}
            >
               {field.values &&
                field.values.map((v) => (
                  <MenuItem key={v.value} value={v.value}>
                    {v.label}
                  </MenuItem>
                ))}
              {this.state.data[field.key] && this.state.data[field.key]?.length > 0 &&
                this.state.data[field.key].map((value) => (
                  <MenuItem key={value.id} value={value.id}>
                    {field?.mapField
                      ? value[field?.mapField]
                      : value.name
                      ? value.name
                      : value.title
                      ? value.title
                      : value.full_name}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>
              {_findKey >= 0 ? _errArr[_findKey].msg : ""}
            </FormHelperText>
          </FormControl>
        );
        break;
      case "textarea":
        _field = (
          <TextField
            multiline
            rows={field?.row ?? 8}
            className="p-0"
            helperText={_findKey >= 0 ? _errArr[_findKey].msg : ""}
            error={_findKey >= 0 ? true : false}
            name={field.key}
            value={this.state.values[field.key] || ""}
            onChange={this.handleChangeValue}
            disabled={_readOnly}
          />
        );
        break;
      case "autoComplete":
        let _key = _.findIndex(this.state.data[field.key], {
          id: this.state.values[field.key],
        });
        if (this.state?.data[field.key]) {
          _field = (
            <Autocomplete
              multiple={field.multiple == false ? false : true}
              size="small"
              options={this.state?.data[field.key] ?? []}
              getOptionLabel={(option) =>
                field?.mapField
                  ? option[field?.mapField]
                  : option?.title ?? option.name
              }
              onChange={(e, v) =>
                this.setState({
                  values: { ...this.state.values, [field.key]: v.id },
                })
              }
              defaultValue={this.state?.data[field.key][_key]}
              renderInput={(params) => (
                <TextField {...params} name={field.key} />
              )}
            />
          );
        }
        break;
      case "password":
        _field = (
          <TextField
            type="password"
            name={field.key}
            onChange={this.handleChangeValue}
            helperText={_findKey >= 0 ? _errArr[_findKey].msg : ""}
            error={_findKey >= 0 ? true : false}
          />
        );
        break;
      case "dateTime":
        _field = (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DateTimePicker
                minDate={field.minDate == true ? new Date() : ""}
                value={this.state.values[field.key] || ""}
                inputFormat="dd/MM/yyyy HH:mm"
                inputProps={{ placeholder: "dd/MM/yyyy HH:mm" }}
                onChange={(v) => {
                  if (v != "") {
                    delete _errArr[_findKey];
                    this.setState({ errors: _errArr });
                  }
                  this.setState({
                    values: { ...this.state.values, [field.key]: v },
                  });
                }}
                renderInput={(params) => {
                  if(params.inputProps.value == '')
                    params.error = false;
                  return(
                  <TextField
                    helperText={_findKey >= 0 ? _errArr[_findKey].msg : ""}
                    className={"dateTime" + (_findKey >= 0 ? " tt-error" : "")}
                    name={field.key}
                    disabled={_readOnly}
                    {...params}
                  />
                )}}
              />
            </Stack>
          </LocalizationProvider>
        );
        break;
      case "dateTimeDMY":
          _field = (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DateTimePicker
                  minDate={field.minDate == true ? new Date() : ""}
                  value={this.state.values[field.key] || ""}
                  inputFormat="yyyy/MM/dd"
                  inputProps={{ placeholder: "yyyy/MM/dd" }}
                  onChange={(v) => {
                    if (v != "") {
                      delete _errArr[_findKey];
                      this.setState({ errors: _errArr });
                    }
                    this.setState({
                      values: { ...this.state.values, [field.key]: v },
                    });
                  }}
                  renderInput={(params) => {
                    if(params.inputProps.value == '')
                      params.error = false;
                    return(
                    <TextField
                      helperText={_findKey >= 0 ? _errArr[_findKey].msg : ""}
                      className={"dateTime" + (_findKey >= 0 ? " tt-error" : "")}
                      name={field.key}
                      disabled={_readOnly}
                      {...params}
                    />
                  )}}
                />
              </Stack>
            </LocalizationProvider>
          );
          break; 
      case "date":
        _field = (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DatePicker
                minDate={
                  field.minDate == true
                    ? new Date()
                    : new Date().setFullYear(new Date().getFullYear() - 100)
                }
                value={this.state.values[field.key] || ""}
                inputFormat="dd/MM/yyyy"
                inputProps={{ placeholder: "dd/MM/yyyy" }}
                onChange={(v) => {
                  if (v != "") {
                    delete _errArr[_findKey];
                    this.setState({ errors: _errArr });
                  }
                  this.setState({
                    values: { ...this.state.values, [field.key]: v },
                  });
                }}
                disabled={_readOnly}
                renderInput={(params) => {
                  if(params.inputProps.value == '')
                    params.error = false;
                  return(
                  <TextField
                    helperText={_findKey >= 0 ? _errArr[_findKey].msg : ""}
                    className={"dateTime" + (_findKey >= 0 ? " tt-error" : "")}
                    name={field.key}
                    disabled={_readOnly}
                    {...params}
                  />
                )}}
              />
            </Stack>
          </LocalizationProvider>
        );
        break;
      case "dateRange":
        _field = (
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            localeText={{ start: "", end: "" }}
          >
            <DateRangePicker
              className="dateRange"
              value={this.state.values[field.key] || [null, null]}
              inputFormat="dd/MM/yyyy"
              onChange={(v) => {
                if (v != "") {
                  delete _errArr[_findKey];
                  this.setState({ errors: _errArr });
                }
                this.setState({
                  values: { ...this.state.values, [field.key]: v },
                });
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField
                    name={field.key + "_to"}
                    {...startProps}
                    inputProps={{
                      ...startProps.inputProps,
                      placeholder: "Start",
                    }}
                  />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField
                    name={field.key + "_from"}
                    {...endProps}
                    inputProps={{
                      ...endProps.inputProps,
                      placeholder: "End",
                    }}
                  />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        );
        break;
      case 'number':
        _field =<TextField
              name={field.key}
              type="number"
              value={this.state.values?.[field.key] ?? 0}
              onChange={this.handleChangeValue}
              helperText={_findKey >= 0 ? _errArr[_findKey].msg : ""}
              error={_findKey >= 0 ? true : false}
              inputProps={{
                min: 1,
                inputMode: "numeric",
                pattern: "[1-9]*",
              }}
              disabled={_readOnly || false}
            />
          break;
      case "label_text":
        let label_val = this.state.values;
        let label_parse = field.key.split('.');
				if(label_parse.length==2) label_val = (label_val[label_parse[0]]&&label_val[label_parse[0]][label_parse[1]])?label_val[label_parse[0]][label_parse[1]]:'';
        else label_val = label_val[field.key]
        _field = (
          <TextField
            rows={field?.row ?? 8}
            className="p-0"
            name={field.key}
            value={label_val || (field?.defaultValue ?? "")}
            onChange={this.handleChangeValue}
            focused={false}
            InputProps={{
              readOnly: true,
            }}
          />
        );
        break;
      case "label_dateTimeDMY":
        _field = (
          <TextField
            rows={field?.row ?? 8}
            className="p-0"
            name={field.key}
            value={moment(this.state.values?.[field.key]).format('DD/MM/YYYY') || (field?.defaultValue ?? "")}
            onChange={this.handleChangeValue}
            focused={false}
            InputProps={{
              readOnly: true,
            }}
          />
        );
        break;
      default:
        let _val = this.state.values;
        let _parse = field.key.split('.');
				if(_parse.length==2) _val = (_val[_parse[0]]&&_val[_parse[0]][_parse[1]])?_val[_parse[0]][_parse[1]]:'';
        else _val = _val[field.key]
        _field = (
          <TextField
            name={field.key}
            value={_val || (field?.defaultValue ?? "")}
            onChange={this.handleChangeValue}
            helperText={_findKey >= 0 ? _errArr[_findKey].msg : ""}
            error={_findKey >= 0 ? true : false}
            InputProps={{
              readOnly: _readOnly,
            }}
            disabled={_readOnly || false}
          />
        );
        break;
    }
    return _field;
  };

  render() {
    let { isAlert, openPopupEdit, module, tabPlatForm } = this.state;
    // console.log("this.state.values",this.state.values)
    return (
      <>
        <form id="form" onSubmit={this.handleSubmit}>
          <DialogContent>
            <div className="row">
              <div
                className={
                  "col-lg-" +
                  (this.props.type !== "tab"
                    ? this.props.hideColRight
                      ? "12"
                      : "8"
                    : "6")
                }
              >
                <div className="card">
                  <div className="cardHead">
                    <h4 className="cardTitle">
                      <span className="cardLabel">
                        {this.props.type === "tab"
                          ? "Name & Socials"
                          : "Thông tin"}
                      </span>
                    </h4>
                  </div>

                  <div className="cardBody">
                    <div className={"form-root p-0 formLayout-" + module}>
                      {this.props.fields.map(
                        (field) =>
                          field.col == "left" && (
                            <>
                              <div key={field.key} className={`_r row ${this.state.hiddenField.includes(field.key)?'hidden':''}`}>
                                <label
                                  htmlFor={field.key}
                                  className="col-lg-3 formLabel d-flex justify-content-end align-items-center text-lg-end text-start"
                                >
                                  {field.label} {field.descriptions}
                                  {field.isRequired && (
                                    <span className="ms-1 color-primary">*</span>
                                  )}
                                </label>
                                <div className="col-lg-9 formControl">
                                  {this.showFields(field)}
                                </div>
                              </div>
                            </>
                          )
                      )}

                    </div>
                  </div>
                </div>
              </div>

              {!this.props.hideColRight && (
                <div
                  className={
                    "col-lg-" + (this.props.type === "tab" ? "6" : "4")
                  }
                >
                  <div className="card mb-25">
                    <div className="cardHead">
                      <h4 className="cardTitle">
                        <span className="cardLabel">
                          {this.props.type === "tab"
                            ? "Profile Details"
                            : "Thiết lập"}
                        </span>
                      </h4>
                    </div>

                    <div className="cardBody">
                      <div className="form-root p-0">
                        {this.props.fields.map(
                          (field) =>
                            field.col == "right" &&
                            (!this.props.router.query?.token) && (
                              <div className={`_r ${this.state.hiddenField.includes(field.key)?'hidden':''}`} key={field.key}>
                                <label
                                  htmlFor={field.key}
                                  className="formLabel"
                                >
                                  {field.label}
                                  {field.isRequired && (
                                    <span className="ms-1 color-primary">
                                      *
                                    </span>
                                  )}
                                </label>
                                <div className="formControl mt-2">
                                  {this.showFields(field)}
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <div className="d-flex justify-content-end">
              <Button
                className="btn btn-light font-weight-bold"
                variant="contained"
                onClick={()=>this.props.detail?this.handleDetailLayout(): this.handleFormLayout()}
              >
                Cancel
              </Button>
              {!this.props.detail&&<Button
                type="submit"
                className="btn btn-primary font-weight-bold ms-3"
                variant="contained"
                disabled={(this.state.isLoading==true?true:false)}
              >
              {this.state.isLoading ?
              (<Spinkit name="sk-fading-circle" color="black" />)
              :"Submit"}
              </Button>}
            </div>
          </DialogActions>
        </form>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stateStatus: state.status,
    stateAccount: state.account
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSuccess: (msg) => {
      dispatch(handleSuccess(msg));
    },
    setFormLayout: (val) => {
      dispatch(setFormLayout(val));
    },
    handleFailure: (msg) => {
      dispatch(handleFailure(msg));
    },
    updateProfile: (val) => {
      dispatch(updateProfile(val));
    },
    setDetailLayout: (val) => {
      dispatch(setDetailLayout(val));
    },
    setImportLayout:val=>{dispatch(setImportLayout(val))},
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FormLayout)
);
