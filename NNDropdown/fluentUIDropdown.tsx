import * as React from 'react';
import { Dropdown, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { Link } from '@fluentui/react/lib/Link';
import { IRenderFunction } from '@fluentui/utilities';
import * as operations from './operations';
import { EntityReference, Setting, DropDownData } from "./interface";
import { IInputs } from './generated/ManifestTypes';
import { useState } from 'react';
import { ISelectableOption } from '@fluentui/react/lib/SelectableOption';
import { EntityRecordLink } from './entityRecordLink';
import { FontIcon } from '@fluentui/react/lib/Icon';

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: {} }; //width: 300

export const NNDropdownControl: React.FC<{ context: ComponentFramework.Context<IInputs>, setting: Setting, dropdowndata: DropDownData }> = ({ context, setting, dropdowndata }) => {

  console.log("In render Control", setting, dropdowndata);

  let targetRef: EntityReference = { entityType: setting.primaryEntityName, id: setting.primaryEntityId };

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption, index: number): void => {

    if (item) {

      setSelectedKeys(
        item.selected ? [...selectedKeys, item.key as string] : selectedKeys.filter(key => key !== item.key),
      );

      if (item.selected === true) {
        operations._writeLog('Associate this item', item);
        let relatedRef: EntityReference = { entityType: setting.targetEntityName, id: item.key.toString() };
        operations._associateRecord(context, setting, targetRef, relatedRef);
      }
      else if (item.selected === false) {
        operations._writeLog('Disassocatie this item', item);
        let relatedRef: EntityReference = { entityType: setting.targetEntityName, id: item.key.toString() };
        operations._disAssociateRecord(context, setting, targetRef, relatedRef);
      }
    }
  };


  const onRenderTitle: IRenderFunction<IDropdownOption[]> = (options, defaultRender) => {

    if (!options || !defaultRender) {
      return null;
    }

    if (!setting.enableLinkToRecord) {
      return defaultRender(options);
    }

    const optionElements = new Array((options.length * 2) - 1)

    options.forEach((option, idx) => {

      const entityRef: EntityReference = {
        entityType: setting.targetEntityName,
        id: option.key as string,
        name: option.title || option.text
      }

      optionElements.push(<EntityRecordLink context={context} entityReference={entityRef} />);

      if (idx !== options.length - 1) {
        optionElements.push(', ');
      }

    });

    return (<span>{optionElements}</span>);

  }

  const onRenderOption: IRenderFunction<ISelectableOption> = (option, defaultRender) => {

    if (!option || !defaultRender) {
      return null;
    }

    if (!setting.enableLinkToRecord) {
      return defaultRender(option);
    }

    const entityRef: EntityReference = {
      entityType: setting.targetEntityName,
      id: option.key as string,
      name: option.title || option.text
    }

    const toolTip = 'Open ' + (entityRef.name || '(no name)');

    return (
      <span style={{display:'flex', width: '100%', flexDirection: 'row', justifyContent:'space-between'}}>
        {defaultRender(option)}
        <EntityRecordLink context={context} entityReference={entityRef} style={{marginLeft:'auto'}}>
          <FontIcon aria-label={toolTip} iconName="ChevronRight"/>
        </EntityRecordLink>
      </span>
    )
  }

  return (
    <Dropdown
      placeholder="---" //Equal to PowerPlatformStandard  //Select options 
      //label="Multi-select controlled example" // No using a label, Power Platform Provides Label
      //selectedKeys={selectedKeys}     
      //@ts-ignore
      onChange={onChange}
      onRenderTitle={onRenderTitle}
      onRenderOption={onRenderOption}
      multiSelect
      defaultSelectedKeys={dropdowndata.selectedOptions} //selectedOptions  
      options={dropdowndata.allOptions} //allOptions 
      styles={dropdownStyles}
    />
  );
};